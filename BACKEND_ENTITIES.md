# Backend Entities & Architecture Findings (TypeORM)

## Brainstorming Session Findings
1. **Frontend Types Remain Unchanged**: To avoid UI regressions and waterfall API calls, the frontend types (`src/types/index.ts`) will NOT be changed to match the flat database tables.
2. **Aggregating Data via ORM**: The NestJS backend will aggregate relational data via SQL Joins using an ORM like TypeORM.
3. **Handling Overfetching and Underfetching**: By utilizing TypeORM relations (`@ManyToOne`, `@OneToMany`), the API endpoints will only pull nested relational data (like a Gig's Seller) when required for UI Views, solving both overfetching and underfetching simultaneously.

---

## NestJS Backend Entities Draft (SQLite + TypeORM)

This accurately maps to the SQLite schema and supports auto-generation of UUIDs in the application logic layer by TypeORM since SQLite lacks a native `UUID` function.

### UserEntity (`backend/src/users/entities/user.entity.ts`)
```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { GigEntity } from '../../gigs/entities/gig.entity';
// Import other relations...

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: 'client' })
  role: string; // Enforced via application logic or SQLite CHECK

  @Column({ type: 'text', nullable: true })
  bio: string;

  @CreateDateColumn()
  joined_at: Date;

  @Column({ type: 'real', default: 0.00 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  total_reviews: number;

  @OneToMany(() => GigEntity, gig => gig.seller)
  gigs: GigEntity[];
}
```

### TagEntity (`backend/src/tags/entities/tag.entity.ts`)
```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tags')
export class TagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;
}
```

### GigEntity (`backend/src/gigs/entities/gig.entity.ts`)
```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { TagEntity } from '../../tags/entities/tag.entity';

@Entity('gigs')
export class GigEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, user => user.gigs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seller_id' })
  seller: UserEntity;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  category: string;

  @Column({ type: 'real' })
  price: number;

  @Column({ type: 'int' })
  delivery_days: number;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ type: 'real', default: 0.00 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  total_reviews: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToMany(() => TagEntity)
  @JoinTable({
    name: 'gig_tags',
    joinColumn: { name: 'gig_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' }
  })
  tags: TagEntity[];
}
```

### OrderEntity (`backend/src/orders/entities/order.entity.ts`)
```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { GigEntity } from '../../gigs/entities/gig.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => GigEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'gig_id' })
  gig: GigEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: UserEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: UserEntity;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'real' })
  price: number;

  @Column({ type: 'text', nullable: true })
  requirements: string;

  @Column()
  delivery_deadline: Date;

  @CreateDateColumn()
  created_at: Date;
}
```

### ReviewEntity (`backend/src/reviews/entities/review.entity.ts`)
```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { GigEntity } from '../../gigs/entities/gig.entity';
import { OrderEntity } from '../../orders/entities/order.entity';

@Entity('reviews')
export class ReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrderEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @ManyToOne(() => GigEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gig_id' })
  gig: GigEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn()
  created_at: Date;
}
```