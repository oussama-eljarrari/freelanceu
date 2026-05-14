export type GigSellerRelation = {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  role?: string;
};

export class GigEntity {
  id: string;
  sellerId: string;
  seller: GigSellerRelation;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryDays: number;
  rating: number;
  totalReviews: number;
  thumbnail: string;
  tags: string[];
  createdAt: string;
}
