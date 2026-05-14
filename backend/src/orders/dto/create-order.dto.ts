export class CreateOrderDto {
  gigId: string;
  gigTitle: string;
  gigDescription: string;
  gigThumbnail: string;
  deliveryDays: number;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  price: number;
  requirements: string;
  deliveryDeadline?: string;
}
