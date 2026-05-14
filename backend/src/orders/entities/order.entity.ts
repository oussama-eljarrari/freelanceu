export type OrderStatus =
  | 'pending'
  | 'in_progress'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export type OrderUserRelation = {
  id: string;
  name: string;
  avatar: string;
  email?: string;
};

export type OrderGigRelation = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  deliveryDays: number;
};

export class OrderEntity {
  id: string;
  gigId: string;
  gig: OrderGigRelation;
  clientId: string;
  client: OrderUserRelation;
  freelancerId: string;
  freelancer: OrderUserRelation;
  status: OrderStatus;
  price: number;
  requirements: string;
  createdAt: string;
  deliveryDeadline: string;
}
