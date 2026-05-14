import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { GigEntity } from './entities/gig.entity';

type GigRow = {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  delivery_days: number;
  thumbnail: string;
  rating: number;
  total_reviews: number;
  created_at: string;
};

@Injectable()
export class GigsRepository {
  constructor(private readonly database: DatabaseService) {}

  create(gig: GigEntity, tags: string[]): void {
    const db = this.database.connection();
    const insert = db.transaction(() => {
      db.prepare(
        `
            INSERT INTO gigs (id, seller_id, title, description, category, price, delivery_days, thumbnail, rating, total_reviews, created_at)
            VALUES (@id, @sellerId, @title, @description, @category, @price, @deliveryDays, @thumbnail, @rating, @totalReviews, @createdAt)
        `,
      ).run(gig);
      this.replaceTags(gig.id, tags);
    });

    insert();
  }

  findAll(): GigEntity[] {
    const rows = this.database
      .connection()
      .prepare('SELECT * FROM gigs ORDER BY created_at DESC')
      .all() as GigRow[];

    return rows.map((row) => this.toGig(row));
  }

  findById(id: string): GigEntity | undefined {
    const row = this.database
      .connection()
      .prepare('SELECT * FROM gigs WHERE id = ?')
      .get(id) as GigRow | undefined;

    return row ? this.toGig(row) : undefined;
  }

  findByIds(ids: string[]): GigEntity[] {
    const uniqueIds = [...new Set(ids)].filter(Boolean);
    if (uniqueIds.length === 0) {
      return [];
    }

    const placeholders = uniqueIds.map(() => '?').join(',');
    const rows = this.database
      .connection()
      .prepare(`SELECT * FROM gigs WHERE id IN (${placeholders})`)
      .all(...uniqueIds) as GigRow[];

    return rows.map((row) => this.toGig(row));
  }

  findBySellerId(sellerId: string): GigEntity[] {
    const rows = this.database
      .connection()
      .prepare(
        'SELECT * FROM gigs WHERE seller_id = ? ORDER BY created_at DESC',
      )
      .all(sellerId) as GigRow[];

    return rows.map((row) => this.toGig(row));
  }

  findByCategory(category: string): GigEntity[] {
    const rows = this.database
      .connection()
      .prepare('SELECT * FROM gigs WHERE category = ? ORDER BY created_at DESC')
      .all(category) as GigRow[];

    return rows.map((row) => this.toGig(row));
  }

  update(
    id: string,
    data: Omit<GigEntity, 'id' | 'sellerId' | 'seller' | 'tags' | 'createdAt'>,
    tags?: string[],
  ): void {
    const db = this.database.connection();
    const update = db.transaction(() => {
      db.prepare(
        `
            UPDATE gigs
            SET title = @title,
                description = @description,
                category = @category,
                price = @price,
                delivery_days = @deliveryDays,
                thumbnail = @thumbnail,
                rating = @rating,
                total_reviews = @totalReviews
            WHERE id = @id
        `,
      ).run({ id, ...data });

      if (tags !== undefined) {
        this.replaceTags(id, tags);
      }
    });

    update();
  }

  delete(id: string): boolean {
    const result = this.database
      .connection()
      .prepare('DELETE FROM gigs WHERE id = ?')
      .run(id);

    return result.changes > 0;
  }

  getCategories(): string[] {
    const rows = this.database
      .connection()
      .prepare('SELECT DISTINCT category FROM gigs ORDER BY category')
      .all() as { category: string }[];

    return rows.map((row) => row.category);
  }

  findTagsByGigIds(gigIds: string[]): Array<{ gigId: string; name: string }> {
    const uniqueIds = [...new Set(gigIds)].filter(Boolean);
    if (uniqueIds.length === 0) {
      return [];
    }

    const placeholders = uniqueIds.map(() => '?').join(',');
    const rows = this.database
      .connection()
      .prepare(
        `
            SELECT gt.gig_id, t.name
            FROM gig_tags gt
            JOIN tags t ON t.id = gt.tag_id
            WHERE gt.gig_id IN (${placeholders})
            ORDER BY t.name
        `,
      )
      .all(...uniqueIds) as Array<{ gig_id: string; name: string }>;

    return rows.map((row) => ({ gigId: row.gig_id, name: row.name }));
  }

  findReviewRelationsByGigIds(gigIds: string[]): Array<{
    gigId: string;
    id: string;
    orderId: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    authorEmail: string;
    rating: number;
    comment: string;
    createdAt: string;
  }> {
    const uniqueIds = [...new Set(gigIds)].filter(Boolean);
    if (uniqueIds.length === 0) {
      return [];
    }

    const placeholders = uniqueIds.map(() => '?').join(',');
    const rows = this.database
      .connection()
      .prepare(
        `
            SELECT r.*, u.id AS author_id, u.name AS author_name, u.avatar AS author_avatar, u.email AS author_email
            FROM reviews r
            JOIN users u ON u.id = r.author_id
            WHERE r.gig_id IN (${placeholders})
            ORDER BY r.created_at DESC
        `,
      )
      .all(...uniqueIds) as Array<{
      id: string;
      order_id: string;
      gig_id: string;
      author_id: string;
      author_name: string;
      author_avatar: string;
      author_email: string;
      rating: number;
      comment: string;
      created_at: string;
    }>;

    return rows.map((row) => ({
      gigId: row.gig_id,
      id: row.id,
      orderId: row.order_id,
      authorId: row.author_id,
      authorName: row.author_name,
      authorAvatar: row.author_avatar,
      authorEmail: row.author_email,
      rating: row.rating,
      comment: row.comment,
      createdAt: row.created_at,
    }));
  }

  private replaceTags(gigId: string, tags: string[]) {
    const db = this.database.connection();
    db.prepare('DELETE FROM gig_tags WHERE gig_id = ?').run(gigId);

    const insertTag = db.prepare(
      'INSERT OR IGNORE INTO tags (id, name) VALUES (?, ?)',
    );
    const insertGigTag = db.prepare(
      'INSERT OR IGNORE INTO gig_tags (gig_id, tag_id) VALUES (?, ?)',
    );

    tags.forEach((name) => {
      const tagId = this.tagId(name);
      insertTag.run(tagId, name);
      insertGigTag.run(gigId, tagId);
    });
  }

  private tagId(name: string) {
    return `tag_${name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '')}`;
  }

  private toGig(row: GigRow): GigEntity {
    return {
      id: row.id,
      sellerId: row.seller_id,
      title: row.title,
      description: row.description,
      category: row.category,
      price: row.price,
      deliveryDays: row.delivery_days,
      rating: row.rating,
      totalReviews: row.total_reviews,
      thumbnail: row.thumbnail,
      tags: [],
      createdAt: row.created_at,
      seller: undefined as any,
    };
  }
}
