export type OrderStatus = 'pending' | 'in_progress' | 'delivered' | 'completed' | 'cancelled';

export type OrderUserSnapshot = {
    id: string;
    name: string;
    avatar: string;
    email?: string;
};

export type OrderGigSnapshot = {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    deliveryDays: number;
};

export class OrderEntity {
    id: string;
    gigId: string;
    gig: OrderGigSnapshot;
    clientId: string;
    client: OrderUserSnapshot;
    freelancerId: string;
    freelancer: OrderUserSnapshot;
    status: OrderStatus;
    price: number;
    requirements: string;
    createdAt: string;
    deliveryDeadline: string;
}