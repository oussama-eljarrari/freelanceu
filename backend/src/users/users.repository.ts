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
export class UsersRepository {
  constructor(private readonly database: DatabaseService) {}

  findAll(): User[] {
    const rows = this.database
      .connection()
      .prepare('SELECT * FROM users ORDER BY joined_at DESC')
      .all() as UserRow[];

    return rows.map((row) => this.toUser(row));
  }

  findById(id: string): User | undefined {
    const row = this.database
      .connection()
      .prepare('SELECT * FROM users WHERE id = ?')
      .get(id) as UserRow | undefined;

    return row ? this.toUser(row) : undefined;
  }

  findByIds(ids: string[]): User[] {
    const uniqueIds = [...new Set(ids)].filter(Boolean);
    if (uniqueIds.length === 0) {
      return [];
    }

    const placeholders = uniqueIds.map(() => '?').join(',');
    const rows = this.database
      .connection()
      .prepare(`SELECT * FROM users WHERE id IN (${placeholders})`)
      .all(...uniqueIds) as UserRow[];

    return rows.map((row) => this.toUser(row));
  }

  findOne(email: string): User | undefined {
    const row = this.database
      .connection()
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email) as UserRow | undefined;

    return row ? this.toUser(row) : undefined;
  }

  create(user: {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar: string;
    role: string;
    bio: string;
    joinedAt: string;
    rating: number;
    totalReviews: number;
  }): User {
    this.database
      .connection()
      .prepare(
        `
            INSERT INTO users (id, name, email, password_hash, avatar, role, bio, joined_at, rating, total_reviews)
            VALUES (@id, @name, @email, @password, @avatar, @role, @bio, @joinedAt, @rating, @totalReviews)
        `,
      )
      .run(user);

    return this.toUser({
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
  }

  update(id: string, data: { name: string; bio: string; avatar: string }) {
    this.database
      .connection()
      .prepare(
        `
            UPDATE users
            SET name = @name, bio = @bio, avatar = @avatar
            WHERE id = @id
        `,
      )
      .run({ id, ...data });
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
