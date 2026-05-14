export class CreateReviewDto {
  gigId: string;
  orderId?: string;
  rating: number;
  comment: string;
}
