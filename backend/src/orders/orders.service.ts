import { Injectable } from '@nestjs/common';
import { GigsService } from 'src/gigs/gigs.service';
import { UsersService } from 'src/users/users.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity, OrderStatus } from './entities/order.entity';
import { OrdersRepository } from './orders.repository';

type SessionUser = {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  role?: string;
};

type Include = 'gig' | 'client' | 'freelancer';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly gigsService: GigsService,
    private readonly usersService: UsersService,
  ) {}

  findAll(include: Include[] = []): OrderEntity[] {
    return this.hydrate(this.ordersRepository.findAll(), include);
  }

  findOne(id: string, include: Include[] = []): OrderEntity | undefined {
    const order = this.ordersRepository.findById(id);
    if (!order) {
      return undefined;
    }

    return this.hydrate([order], include)[0];
  }

  findForUser(user: SessionUser, include: Include[] = []): OrderEntity[] {
    const orders =
      user.role === 'admin'
        ? this.ordersRepository.findAll()
        : this.ordersRepository.findForUser(user.id);

    return this.hydrate(orders, include);
  }

  create(payload: CreateOrderDto, client: SessionUser): OrderEntity {
    const gig = this.gigsService.findOne(payload.gigId);
    if (!gig) {
      return null as any;
    }

    const freelancerId = payload.freelancerId || gig.sellerId;
    const users = this.usersService.publicUsers([freelancerId, client.id]);
    const freelancer = users.find((user) => user.id === freelancerId);
    const clientUser = users.find((user) => user.id === client.id);
    if (!freelancer || !clientUser) {
      return null as any;
    }

    const createdAt = new Date().toISOString();
    const deliveryDays = payload.deliveryDays ?? gig.deliveryDays;
    const deliveryDeadline =
      payload.deliveryDeadline ??
      new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000).toISOString();

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
      gig: undefined as any,
      client: undefined as any,
      freelancer: undefined as any,
    };

    this.ordersRepository.create(order);

    return this.findOne(order.id, [
      'gig',
      'client',
      'freelancer',
    ]) as OrderEntity;
  }

  update(
    id: string,
    payload: UpdateOrderDto,
    include: Include[] = [],
  ): OrderEntity | null {
    const order = this.findOne(id);
    if (!order) {
      return null;
    }

    this.ordersRepository.update(id, {
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
      const gigs = this.gigsService.findByIds(
        orders.map((order) => order.gigId),
        ['tags'],
      );

      orders.forEach((order) => {
        const gig = gigs.find((row) => row.id === order.gigId);
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
      const clients = this.usersService.publicUsers(
        orders.map((order) => order.clientId),
      );

      orders.forEach((order) => {
        const client = clients.find((row) => row.id === order.clientId);
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
      const freelancers = this.usersService.publicUsers(
        orders.map((order) => order.freelancerId),
      );

      orders.forEach((order) => {
        const freelancer = freelancers.find(
          (row) => row.id === order.freelancerId,
        );
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

  private createId(): string {
    return `o_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}
