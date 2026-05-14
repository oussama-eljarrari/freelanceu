import { Injectable } from '@nestjs/common';
import { OrdersService } from 'src/orders/orders.service';
import { UsersService } from 'src/users/users.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewEntity } from './entities/review.entity';
import { ReviewsRepository } from './reviews.repository';

type SessionUser = {
  id: string;
  name: string;
  avatar: string;
  email?: string;
};

type Include = 'author';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
  ) {}

  create(dto: CreateReviewDto, user: SessionUser): ReviewEntity {
    if (dto.orderId && !this.ordersService.findOne(dto.orderId)) {
      return null as any;
    }

    const review = {
      id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      gigId: dto.gigId,
      orderId: dto.orderId ?? null,
      authorId: user.id,
      rating: dto.rating,
      comment: dto.comment,
      createdAt: new Date().toISOString(),
    };

    this.reviewsRepository.create(review);

    return this.findOne(review.id, ['author']) as ReviewEntity;
  }

  findByGigId(gigId: string, include: Include[] = []): ReviewEntity[] {
    return this.hydrate(this.reviewsRepository.findByGigId(gigId), include);
  }

  findByGigIds(gigIds: string[], include: Include[] = []): ReviewEntity[] {
    return this.hydrate(this.reviewsRepository.findByGigIds(gigIds), include);
  }

  findAll(include: Include[] = []): ReviewEntity[] {
    return this.hydrate(this.reviewsRepository.findAll(), include);
  }

  findOne(id: string, include: Include[] = []): ReviewEntity | null {
    const review = this.reviewsRepository.findById(id);
    if (!review) {
      return null;
    }

    return this.hydrate([review], include)[0];
  }

  delete(id: string): boolean {
    return this.reviewsRepository.delete(id);
  }

  private hydrate(reviews: ReviewEntity[], include: Include[]): ReviewEntity[] {
    if (!include.includes('author')) {
      return reviews;
    }

    const authors = this.usersService.publicUsers(
      reviews.map((review) => review.authorId),
    );

    reviews.forEach((review) => {
      const author = authors.find((user) => user.id === review.authorId);
      if (author) {
        review.author = {
          id: author.id,
          name: author.name ?? '',
          avatar: author.avatar ?? '',
          email: author.email,
        };
      }
    });

    return reviews;
  }
}
