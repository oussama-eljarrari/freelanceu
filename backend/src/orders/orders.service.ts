import { Injectable } from '@nestjs/common';
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

@Injectable()
export class OrdersService {
    private readonly orders: OrderEntity[] = [
        {
            id: 'o1',
            gigId: 'g1',
            gig: {
                id: 'g1',
                title: 'I will design a professional logo for your brand',
                description: 'High quality logo design with unlimited revisions. Delivered in PNG, SVG, and AI formats. Includes brand color palette.',
                thumbnail: 'https://picsum.photos/seed/logo/400/300',
                deliveryDays: 3,
            },
            clientId: 'u3',
            client: {
                id: 'u3',
                name: 'Lina Ouhab',
                avatar: 'https://i.pravatar.cc/150?img=23',
                email: 'lina@example.com',
            },
            freelancerId: 'u1',
            freelancer: {
                id: 'u1',
                name: 'Sara Malik',
                avatar: 'https://i.pravatar.cc/150?img=47',
                email: 'sara@example.com',
            },
            status: 'in_progress',
            price: 50,
            requirements: 'I need a logo for my coffee shop called Brew & Co. Colors: brown and cream.',
            createdAt: '2025-04-20',
            deliveryDeadline: '2025-04-23',
        },
        {
            id: 'o2',
            gigId: 'g2',
            gig: {
                id: 'g2',
                title: 'I will build a React web app with NestJS backend',
                description: 'Full-stack development with clean code, REST API, and deployment. Includes authentication and database setup.',
                thumbnail: 'https://picsum.photos/seed/dev/400/300',
                deliveryDays: 14,
            },
            clientId: 'u3',
            client: {
                id: 'u3',
                name: 'Lina Ouhab',
                avatar: 'https://i.pravatar.cc/150?img=23',
                email: 'lina@example.com',
            },
            freelancerId: 'u2',
            freelancer: {
                id: 'u2',
                name: 'Karim Benali',
                avatar: 'https://i.pravatar.cc/150?img=12',
                email: 'karim@example.com',
            },
            status: 'completed',
            price: 300,
            requirements: 'E-commerce app with Stripe payments and product catalog.',
            createdAt: '2025-03-01',
            deliveryDeadline: '2025-03-15',
        },
        {
            id: 'o3',
            gigId: 'g3',
            gig: {
                id: 'g3',
                title: 'I will create social media graphics for your business',
                description: 'Eye-catching posts and stories for Instagram, Facebook, and LinkedIn. Delivered in all required sizes.',
                thumbnail: 'https://picsum.photos/seed/social/400/300',
                deliveryDays: 2,
            },
            clientId: 'u3',
            client: {
                id: 'u3',
                name: 'Lina Ouhab',
                avatar: 'https://i.pravatar.cc/150?img=23',
                email: 'lina@example.com',
            },
            freelancerId: 'u1',
            freelancer: {
                id: 'u1',
                name: 'Sara Malik',
                avatar: 'https://i.pravatar.cc/150?img=47',
                email: 'sara@example.com',
            },
            status: 'pending',
            price: 30,
            requirements: 'Need 10 Instagram posts for a skincare brand launch.',
            createdAt: '2025-04-28',
            deliveryDeadline: '2025-04-30',
        },
    ];

    private createId(): string {
        return `o_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }

    findAll(): OrderEntity[] {
        return this.orders;
    }

    findOne(id: string): OrderEntity | undefined {
        return this.orders.find((order) => order.id === id);
    }

    findForUser(user: SessionUser): OrderEntity[] {
        if (user.role === 'admin') {
            return this.orders;
        }

        return this.orders.filter((order) => order.clientId === user.id || order.freelancerId === user.id);
    }

    create(payload: CreateOrderDto, client: SessionUser): OrderEntity {
        const createdAt = new Date().toISOString();
        const deliveryDeadline = payload.deliveryDeadline ?? new Date(Date.now() + payload.deliveryDays * 24 * 60 * 60 * 1000).toISOString();

        const order: OrderEntity = {
            id: this.createId(),
            gigId: payload.gigId,
            gig: {
                id: payload.gigId,
                title: payload.gigTitle,
                description: payload.gigDescription,
                thumbnail: payload.gigThumbnail,
                deliveryDays: payload.deliveryDays,
            },
            clientId: client.id,
            client: {
                id: client.id,
                name: client.name,
                avatar: client.avatar,
                email: client.email,
            },
            freelancerId: payload.freelancerId,
            freelancer: {
                id: payload.freelancerId,
                name: payload.freelancerName,
                avatar: payload.freelancerAvatar,
            },
            status: 'pending',
            price: payload.price,
            requirements: payload.requirements,
            createdAt,
            deliveryDeadline,
        };

        this.orders.unshift(order);
        return order;
    }

    update(id: string, payload: UpdateOrderDto): OrderEntity | null {
        const order = this.findOne(id);

        if (!order) {
            return null;
        }

        if (payload.status) {
            order.status = payload.status;
        }

        if (payload.requirements !== undefined) {
            order.requirements = payload.requirements;
        }

        if (payload.deliveryDeadline !== undefined) {
            order.deliveryDeadline = payload.deliveryDeadline;
        }

        if (payload.price !== undefined) {
            order.price = payload.price;
        }

        return order;
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
}