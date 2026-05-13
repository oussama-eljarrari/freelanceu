import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { OrdersService } from 'src/orders/orders.service';
import { UsersService } from 'src/users/users.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewEntity } from './entities/review.entity';

type SessionUser = {
    id: string;
    name: string;
    avatar: string;
    email?: string;
};

type ReviewRow = {
    id: string;
    order_id?: string;
    gig_id: string;
    author_id: string;
    rating: number;
    comment: string;
    created_at: string;
};

type Include = 'author';

@Injectable()
export class ReviewsService {
    constructor(
        private readonly database: DatabaseService,
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

        this.database.connection().prepare(`
            INSERT INTO reviews (id, order_id, gig_id, author_id, rating, comment, created_at)
            VALUES (@id, @orderId, @gigId, @authorId, @rating, @comment, @createdAt)
        `).run(review);

        return this.findOne(review.id, ['author']) as ReviewEntity;
    }

    findByGigId(gigId: string, include: Include[] = []): ReviewEntity[] {
        const rows = this.database.connection().prepare('SELECT * FROM reviews WHERE gig_id = ? ORDER BY created_at DESC').all(gigId) as ReviewRow[];

        
        return this.hydrate(rows.map((row) => this.toReview(row)), include);
    }

    findAll(include: Include[] = []): ReviewEntity[] {
        const rows = this.database.connection().prepare('SELECT * FROM reviews ORDER BY created_at DESC').all() as ReviewRow[];
        return this.hydrate(rows.map((row) => this.toReview(row)), include);
    }

    findOne(id: string, include: Include[] = []): ReviewEntity | null {
        const row = this.database.connection().prepare('SELECT * FROM reviews WHERE id = ?').get(id) as ReviewRow | undefined;
        if (!row) {
            return null;
        }

        return this.hydrate([this.toReview(row)], include)[0];
    }

    delete(id: string): boolean {
        const result = this.database.connection().prepare('DELETE FROM reviews WHERE id = ?').run(id);
        return result.changes > 0;
    }

    private hydrate(reviews: ReviewEntity[], include: Include[]): ReviewEntity[] {
        if (!include.includes('author')) {
            return reviews;
        }

        reviews.forEach((review) => {
            const author = this.usersService.publicUser(review.authorId);
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

    private toReview(row: ReviewRow): ReviewEntity {
        return new ReviewEntity({
            id: row.id,
            orderId: row.order_id,
            gigId: row.gig_id,
            authorId: row.author_id,
            rating: row.rating,
            comment: row.comment,
            createdAt: row.created_at,
        });
    }
}
