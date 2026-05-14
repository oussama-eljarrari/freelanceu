export class ReviewEntity {
  id: string;
  orderId?: string;
  gigId: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
    avatar: string;
    email?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;

  constructor(data?: Partial<ReviewEntity>) {
    Object.assign(this, data);
  }
}
