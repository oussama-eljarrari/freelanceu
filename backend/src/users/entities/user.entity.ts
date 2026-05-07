export class User {
  id: string;
  username: string; // typically the email for login
  email?: string;
  name?: string;
  password?: string;
  avatar?: string;
  role?: string;
  bio?: string;
  joinedAt?: string;
  rating?: number;
  totalReviews?: number;
  createdAt: Date;
}
