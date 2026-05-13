import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateGigDto } from './dto/create-gig.dto';
import { UpdateGigDto } from './dto/update-gig.dto';
import { GigEntity } from './entities/gig.entity';

type SessionUser = {
    id: string;
    name: string;
    avatar: string;
    email?: string;
    role?: string;
};

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

type Include = 'seller' | 'tags' | 'reviews';

@Injectable()
export class GigsService {
    constructor(private readonly database: DatabaseService) {}

    create(dto: CreateGigDto, user: SessionUser): GigEntity {
        const gig = {
            id: `g_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            sellerId: user.id,
            title: dto.title,
            description: dto.description,
            category: dto.category,
            price: dto.price,
            deliveryDays: dto.deliveryDays,
            thumbnail: dto.thumbnail || 'https://picsum.photos/seed/default/400/300',
            rating: 0,
            totalReviews: 0,
            createdAt: new Date().toISOString(),
        };

        const db = this.database.connection();
        const insert = db.transaction(() => {
            db.prepare(`
                INSERT INTO gigs (id, seller_id, title, description, category, price, delivery_days, thumbnail, rating, total_reviews, created_at)
                VALUES (@id, @sellerId, @title, @description, @category, @price, @deliveryDays, @thumbnail, @rating, @totalReviews, @createdAt)
            `).run(gig);
            this.replaceTags(gig.id, dto.tags ?? []);
        });
        insert();

        return this.findOne(gig.id, ['seller', 'tags']) as GigEntity;
    }

    findAll(include: Include[] = []): GigEntity[] {
        const rows = this.database.connection().prepare('SELECT * FROM gigs ORDER BY created_at DESC').all() as GigRow[];
        return this.hydrate(rows.map((row) => this.toGig(row)), include);
    }

    findOne(id: string, include: Include[] = []): GigEntity | undefined {
        const row = this.database.connection().prepare('SELECT * FROM gigs WHERE id = ?').get(id) as GigRow | undefined;
        if (!row) {
            return undefined;
        }

        return this.hydrate([this.toGig(row)], include)[0];
    }

    findByUser(user: SessionUser, include: Include[] = []): GigEntity[] {
        const rows = this.database.connection().prepare('SELECT * FROM gigs WHERE seller_id = ? ORDER BY created_at DESC').all(user.id) as GigRow[];
        return this.hydrate(rows.map((row) => this.toGig(row)), include);
    }

    findByCategory(category: string, include: Include[] = []): GigEntity[] {
        const rows = this.database.connection().prepare('SELECT * FROM gigs WHERE category = ? ORDER BY created_at DESC').all(category) as GigRow[];
        return this.hydrate(rows.map((row) => this.toGig(row)), include);
    }

    update(id: string, dto: UpdateGigDto, include: Include[] = []): GigEntity | undefined {
        const gig = this.findOne(id);
        if (!gig) {
            return undefined;
        }

        const data = {
            id,
            title: dto.title ?? gig.title,
            description: dto.description ?? gig.description,
            category: dto.category ?? gig.category,
            price: dto.price ?? gig.price,
            deliveryDays: dto.deliveryDays ?? gig.deliveryDays,
            thumbnail: dto.thumbnail ?? gig.thumbnail,
            rating: dto.rating ?? gig.rating,
            totalReviews: dto.totalReviews ?? gig.totalReviews,
        };

        const db = this.database.connection();
        const update = db.transaction(() => {
            db.prepare(`
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
            `).run(data);

            if (dto.tags !== undefined) {
                this.replaceTags(id, dto.tags);
            }
        });
        update();

        return this.findOne(id, include);
    }

    delete(id: string): boolean {
        const result = this.database.connection().prepare('DELETE FROM gigs WHERE id = ?').run(id);
        return result.changes > 0;
    }

    getCategories(): string[] {
        const rows = this.database.connection().prepare('SELECT DISTINCT category FROM gigs ORDER BY category').all() as { category: string }[];
        return rows.map((row) => row.category);
    }

    private hydrate(gigs: GigEntity[], include: Include[]): GigEntity[] {
        if (gigs.length === 0) {
            return gigs;
        }

        const db = this.database.connection();
        const ids = gigs.map((gig) => gig.id);
        const placeholders = ids.map(() => '?').join(',');
    

        if (include.includes('seller')) {
            const sellers = db.prepare(`
                SELECT g.id AS gig_id, u.id, u.name, u.avatar, u.email, u.role
                FROM gigs g
                JOIN users u ON u.id = g.seller_id
                WHERE g.id IN (${placeholders})
            `).all(...ids) as Array<{ gig_id: string; id: string; name: string; avatar: string; email: string; role: string }>;

            gigs.forEach((gig) => {
                const seller = sellers.find((row) => row.gig_id === gig.id);
                if (seller) {
                    gig.seller = {
                        id: seller.id,
                        name: seller.name,
                        avatar: seller.avatar,
                        email: seller.email,
                        role: seller.role,
                    };
                }
            });
        }

        if (include.includes('tags')) {
            const tags = db.prepare(`
                SELECT gt.gig_id, t.name
                FROM gig_tags gt
                JOIN tags t ON t.id = gt.tag_id
                WHERE gt.gig_id IN (${placeholders})
                ORDER BY t.name
            `).all(...ids) as Array<{ gig_id: string; name: string }>;

            gigs.forEach((gig) => {
                gig.tags = tags.filter((tag) => tag.gig_id === gig.id).map((tag) => tag.name);
            });
        }

        if (include.includes('reviews')) {
            const reviews = db.prepare(`
                SELECT r.*, u.id AS author_id, u.name AS author_name, u.avatar AS author_avatar, u.email AS author_email
                FROM reviews r
                JOIN users u ON u.id = r.author_id
                WHERE r.gig_id IN (${placeholders})
                ORDER BY r.created_at DESC
            `).all(...ids) as Array<{
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

            gigs.forEach((gig) => {
                (gig as GigEntity & { reviews?: unknown[] }).reviews = reviews
                    .filter((review) => review.gig_id === gig.id)
                    .map((review) => ({
                        id: review.id,
                        orderId: review.order_id,
                        gigId: review.gig_id,
                        authorId: review.author_id,
                        author: {
                            id: review.author_id,
                            name: review.author_name,
                            avatar: review.author_avatar,
                            email: review.author_email,
                        },
                        rating: review.rating,
                        comment: review.comment,
                        createdAt: review.created_at,
                    }));
            });
        }

        return gigs;
    }

    private replaceTags(gigId: string, tags: string[]) {
        const db = this.database.connection();
        db.prepare('DELETE FROM gig_tags WHERE gig_id = ?').run(gigId);

        const insertTag = db.prepare('INSERT OR IGNORE INTO tags (id, name) VALUES (?, ?)');
        const insertGigTag = db.prepare('INSERT OR IGNORE INTO gig_tags (gig_id, tag_id) VALUES (?, ?)');

        tags.forEach((name) => {
            const tagId = this.tagId(name);
            insertTag.run(tagId, name);
            insertGigTag.run(gigId, tagId);
        });
    }

    private tagId(name: string) {
        return `tag_${name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}`;
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
