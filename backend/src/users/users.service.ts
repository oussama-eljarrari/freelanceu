import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from './entities/user.entity';

type UserRow = {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    avatar: string;
    role: string;
    bio: string;
    joined_at: string;
    rating: number;
    total_reviews: number;
};

@Injectable()
export class UsersService {
    constructor(private readonly database: DatabaseService) {}

    findAll(): User[] {
        const rows = this.database.connection().prepare('SELECT * FROM users ORDER BY joined_at DESC').all() as UserRow[];
        return rows.map((row) => this.toUser(row));
    }

    findById(id: string): User | undefined {
        const row = this.database.connection().prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined;
        return row ? this.toUser(row) : undefined;
    }

    create({ name, email, password }: { name: string; email: string; password: string }): Omit<User, 'password'> {
        const createdAt = new Date();
        const joinedAt = createdAt.toISOString().slice(0, 10);
        const user = {
            id: `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            name,
            email,
            password,
            avatar: generateAvatar(name),
            role: 'client',
            bio: 'New on the platform and excited to get started.',
            joinedAt,
            rating: 0,
            totalReviews: 0,
        };

        this.database.connection().prepare(`
            INSERT INTO users (id, name, email, password_hash, avatar, role, bio, joined_at, rating, total_reviews)
            VALUES (@id, @name, @email, @password, @avatar, @role, @bio, @joinedAt, @rating, @totalReviews)
        `).run(user);

        const { password: _, ...result } = this.toUser({
            id: user.id,
            name: user.name,
            email: user.email,
            password_hash: user.password,
            avatar: user.avatar,
            role: user.role,
            bio: user.bio,
            joined_at: user.joinedAt,
            rating: user.rating,
            total_reviews: user.totalReviews,
        });

        return result;
    }

    findOne(email: string): User | undefined {
        const row = this.database.connection().prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined;
        return row ? this.toUser(row) : undefined;
    }

    update(id: string, updateData: Partial<User>): User | undefined {
        const current = this.findById(id);
        if (!current) {
            return undefined;
        }

        const data = {
            id,
            name: updateData.name ?? current.name,
            bio: updateData.bio ?? current.bio,
            avatar: updateData.avatar ?? current.avatar,
        };

        this.database.connection().prepare(`
            UPDATE users
            SET name = @name, bio = @bio, avatar = @avatar
            WHERE id = @id
        `).run(data);

        return this.findById(id);
    }

    publicUser(id: string) {
        const user = this.findById(id);
        if (!user) {
            return undefined;
        }

        const { password, ...result } = user;
        return result;
    }

    private toUser(row: UserRow): User {
        return {
            id: row.id,
            username: row.email,
            email: row.email,
            name: row.name,
            password: row.password_hash,
            avatar: row.avatar,
            role: row.role,
            bio: row.bio,
            joinedAt: row.joined_at,
            rating: row.rating,
            totalReviews: row.total_reviews,
            createdAt: new Date(row.joined_at),
        };
    }
}

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2);
    return `${parts[0][0]}${parts[parts.length - 1][0]}`;
}

function pickColor(seed: string): string {
    const colors = ['#6C5CE7', '#00B894', '#0984E3', '#E17055'];
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
        h = (h << 5) - h + seed.charCodeAt(i);
        h |= 0;
    }
    return colors[Math.abs(h) % colors.length];
}

function generateAvatar(name: string): string {
    const initials = getInitials(name).toUpperCase();
    const bg = pickColor(name);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'>
    <rect width='100%' height='100%' fill='${bg}' rx='12'/>
    <text x='50%' y='50%' dy='.35em' text-anchor='middle'
      fill='#fff' font-family='Arial' font-size='48' font-weight='600'>${initials}</text>
  </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
