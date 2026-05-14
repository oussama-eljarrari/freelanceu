import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ReviewEntity } from './entities/review.entity';

type ReviewRow = {
  id: string;
  order_id?: string;
  gig_id: string;
  author_id: string;
  rating: number;
  comment: string;
  created_at: string;
};

@Injectable()
export class ReviewsRepository {
  constructor(private readonly database: DatabaseService) {}

  create(review: {
    id: string;
    gigId: string;
    orderId: string | null;
    authorId: string;
    rating: number;
    comment: string;
    createdAt: string;
  }): void {
    this.database
      .connection()
      .prepare(
        `
            INSERT INTO reviews (id, order_id, gig_id, author_id, rating, comment, created_at)
            VALUES (@id, @orderId, @gigId, @authorId, @rating, @comment, @createdAt)
        `,
      )
      .run(review);
  }

  findByGigId(gigId: string): ReviewEntity[] {
    const rows = this.database
      .connection()
      .prepare(
        'SELECT * FROM reviews WHERE gig_id = ? ORDER BY created_at DESC',
      )
      .all(gigId) as ReviewRow[];

    return rows.map((row) => this.toReview(row));
  }

  findByGigIds(gigIds: string[]): ReviewEntity[] {
    const uniqueIds = [...new Set(gigIds)].filter(Boolean);
    if (uniqueIds.length === 0) {
      return [];
    }

    const placeholders = uniqueIds.map(() => '?').join(',');
    const rows = this.database
      .connection()
      .prepare(
        `
            SELECT * FROM reviews
            WHERE gig_id IN (${placeholders})
            ORDER BY created_at DESC
        `,
      )
      .all(...uniqueIds) as ReviewRow[];

    return rows.map((row) => this.toReview(row));
  }

  findAll(): ReviewEntity[] {
    const rows = this.database
      .connection()
      .prepare('SELECT * FROM reviews ORDER BY created_at DESC')
      .all() as ReviewRow[];

    return rows.map((row) => this.toReview(row));
  }

  findById(id: string): ReviewEntity | null {
    const row = this.database
      .connection()
      .prepare('SELECT * FROM reviews WHERE id = ?')
      .get(id) as ReviewRow | undefined;

    return row ? this.toReview(row) : null;
  }

  delete(id: string): boolean {
    const result = this.database
      .connection()
      .prepare('DELETE FROM reviews WHERE id = ?')
      .run(id);

    return result.changes > 0;
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
