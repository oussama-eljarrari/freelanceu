import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewEntity } from './entities/review.entity';

type SessionUser = {
    id: string;
    name: string;
    avatar: string;
    email?: string;
};

@Injectable()
export class ReviewsService {
    private readonly reviews: ReviewEntity[] = [];

    create(dto: CreateReviewDto, user: SessionUser): ReviewEntity {
        const review = new ReviewEntity();
        review.id = `r_${Math.random().toString(36).substr(2, 9)}`;
        review.gigId = dto.gigId;
        review.orderId = dto.orderId;
        review.authorId = user.id;
        review.author = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            email: user.email,
        };
        review.rating = dto.rating;
        review.comment = dto.comment;
        review.createdAt = new Date().toISOString();

        this.reviews.push(review);
        return review;
    }

    findByGigId(gigId: string): ReviewEntity[] {
        return this.reviews.filter(r => r.gigId === gigId);
    }

    findAll(): ReviewEntity[] {
        return this.reviews;
    }

    findOne(id: string): ReviewEntity | null {
        return this.reviews.find(r => r.id === id) || null;
    }

    delete(id: string): boolean {
        const index = this.reviews.findIndex(r => r.id === id);
        if (index >= 0) {
            this.reviews.splice(index, 1);
            return true;
        }
        return false;
    }
}
