import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { GigsService } from 'src/gigs/gigs.service';
import { UsersService } from 'src/users/users.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity, OrderStatus } from './entities/order.entity';

type SessionUser = {
    id: string;
    name: string;
    avatar: string;
    email?: string;
    role?: string;
};

type OrderRow = {
    id: string;
    gig_id: string;
    client_id: string;
    freelancer_id: string;
    status: OrderStatus;
    price: number;
    requirements: string;
    delivery_deadline: string;
    created_at: string;
};

type Include = 'gig' | 'client' | 'freelancer';

@Injectable()
export class OrdersService {
    constructor(
        private readonly database: DatabaseService,
        private readonly gigsService: GigsService,
        private readonly usersService: UsersService,
    ) {}

    findAll(include: Include[] = []): OrderEntity[] {
        const rows = this.db().prepare('SELECT * FROM orders ORDER BY created_at DESC').all() as OrderRow[];
        return this.hydrate(rows.map((row) => this.toOrder(row)), include);
    }

    findOne(id: string, include: Include[] = []): OrderEntity | undefined {
        const row = this.db().prepare('SELECT * FROM orders WHERE id = ?').get(id) as OrderRow | undefined;
        if (!row) {
            return undefined;
        }

        return this.hydrate([this.toOrder(row)], include)[0];
    }

    findForUser(user: SessionUser, include: Include[] = []): OrderEntity[] {
        const rows = user.role === 'admin'
            ? this.db().prepare('SELECT * FROM orders ORDER BY created_at DESC').all()
            : this.db().prepare(`
                SELECT * FROM orders
                WHERE client_id = ? OR freelancer_id = ?
                ORDER BY created_at DESC
            `).all(user.id, user.id);

        return this.hydrate((rows as OrderRow[]).map((row) => this.toOrder(row)), include);
    }

    create(payload: CreateOrderDto, client: SessionUser): OrderEntity {
        const gig = this.gigsService.findOne(payload.gigId);
        if (!gig) {
            return null as any;
        }

        const freelancerId = payload.freelancerId || gig.sellerId;
        const freelancer = this.usersService.findById(freelancerId);
        const clientUser = this.usersService.findById(client.id);
        if (!freelancer || !clientUser) {
            return null as any;
        }

        const createdAt = new Date().toISOString();
        const deliveryDays = payload.deliveryDays ?? gig.deliveryDays;
        const deliveryDeadline = payload.deliveryDeadline ?? new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000).toISOString();

        const order = {
            id: this.createId(),
            gigId: gig.id,
            clientId: client.id,
            freelancerId,
            status: 'pending' as OrderStatus,
            price: payload.price ?? gig.price,
            requirements: payload.requirements,
            createdAt,
            deliveryDeadline,
        };

        this.db().prepare(`
            INSERT INTO orders (id, gig_id, client_id, freelancer_id, status, price, requirements, delivery_deadline, created_at)
            VALUES (@id, @gigId, @clientId, @freelancerId, @status, @price, @requirements, @deliveryDeadline, @createdAt)
        `).run(order);

        return this.findOne(order.id, ['gig', 'client', 'freelancer']) as OrderEntity;
    }

    update(id: string, payload: UpdateOrderDto, include: Include[] = []): OrderEntity | null {
        const order = this.findOne(id);
        if (!order) {
            return null;
        }

        this.db().prepare(`
            UPDATE orders
            SET status = @status,
                requirements = @requirements,
                delivery_deadline = @deliveryDeadline,
                price = @price
            WHERE id = @id
        `).run({
            id,
            status: payload.status ?? order.status,
            requirements: payload.requirements ?? order.requirements,
            deliveryDeadline: payload.deliveryDeadline ?? order.deliveryDeadline,
            price: payload.price ?? order.price,
        });

        return this.findOne(id, include) ?? null;
    }

    getStatusCounts(orders: OrderEntity[]) {
        return orders.reduce(
            (acc, order) => {
                if (order.status === 'completed' || order.status === 'delivered') {
                    acc.completed += 1;
                }

                if (order.status === 'in_progress') {
                    acc.inProgress += 1;
                }

                if (order.status === 'pending') {
                    acc.pending += 1;
                }

                return acc;
            },
            {
                total: orders.length,
                completed: 0,
                inProgress: 0,
                pending: 0,
            },
        );
    }

    private hydrate(orders: OrderEntity[], include: Include[]): OrderEntity[] {
        if (orders.length === 0) {
            return orders;
        }

        if (include.includes('gig')) {
            orders.forEach((order) => {
                const gig = this.gigsService.findOne(order.gigId, ['tags']);
                if (gig) {
                    order.gig = {
                        id: gig.id,
                        title: gig.title,
                        description: gig.description,
                        thumbnail: gig.thumbnail,
                        deliveryDays: gig.deliveryDays,
                    };
                }
            });
        }

        if (include.includes('client')) {
            orders.forEach((order) => {
                const client = this.usersService.publicUser(order.clientId);
                if (client) {
                    order.client = {
                        id: client.id,
                        name: client.name ?? '',
                        avatar: client.avatar ?? '',
                        email: client.email,
                    };
                }
            });
        }

        if (include.includes('freelancer')) {
            orders.forEach((order) => {
                const freelancer = this.usersService.publicUser(order.freelancerId);
                if (freelancer) {
                    order.freelancer = {
                        id: freelancer.id,
                        name: freelancer.name ?? '',
                        avatar: freelancer.avatar ?? '',
                        email: freelancer.email,
                    };
                }
            });
        }

        return orders;
    }

    private toOrder(row: OrderRow): OrderEntity {
        return {
            id: row.id,
            gigId: row.gig_id,
            gig: undefined as any,
            clientId: row.client_id,
            client: undefined as any,
            freelancerId: row.freelancer_id,
            freelancer: undefined as any,
            status: row.status,
            price: row.price,
            requirements: row.requirements,
            createdAt: row.created_at,
            deliveryDeadline: row.delivery_deadline,
        };
    }

    private createId(): string {
        return `o_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }

    private db() {
        return this.database.connection();
    }
}
