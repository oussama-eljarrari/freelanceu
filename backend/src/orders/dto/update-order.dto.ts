import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderDto {
    status?: OrderStatus;
    requirements?: string;
    deliveryDeadline?: string;
    price?: number;
}