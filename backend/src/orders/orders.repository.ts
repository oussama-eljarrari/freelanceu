import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { OrderEntity, OrderStatus } from './entities/order.entity';

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

@Injectable()
export class OrdersRepository {
  constructor(private readonly database: DatabaseService) {}

  findAll(): OrderEntity[] {
    const rows = this.db()
      .prepare('SELECT * FROM orders ORDER BY created_at DESC')
      .all() as OrderRow[];

    return rows.map((row) => this.toOrder(row));
  }

  findById(id: string): OrderEntity | undefined {
    const row = this.db()
      .prepare('SELECT * FROM orders WHERE id = ?')
      .get(id) as OrderRow | undefined;

    return row ? this.toOrder(row) : undefined;
  }

  findForUser(userId: string): OrderEntity[] {
    const rows = this.db()
      .prepare(
        `
            SELECT * FROM orders
            WHERE client_id = ? OR freelancer_id = ?
            ORDER BY created_at DESC
        `,
      )
      .all(userId, userId) as OrderRow[];

    return rows.map((row) => this.toOrder(row));
  }

  create(order: OrderEntity): void {
    this.db()
      .prepare(
        `
            INSERT INTO orders (id, gig_id, client_id, freelancer_id, status, price, requirements, delivery_deadline, created_at)
            VALUES (@id, @gigId, @clientId, @freelancerId, @status, @price, @requirements, @deliveryDeadline, @createdAt)
        `,
      )
      .run(order);
  }

  update(
    id: string,
    data: {
      status: OrderStatus;
      requirements: string;
      deliveryDeadline: string;
      price: number;
    },
  ): void {
    this.db()
      .prepare(
        `
            UPDATE orders
            SET status = @status,
                requirements = @requirements,
                delivery_deadline = @deliveryDeadline,
                price = @price
            WHERE id = @id
        `,
      )
      .run({ id, ...data });
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

  private db() {
    return this.database.connection();
  }
}
