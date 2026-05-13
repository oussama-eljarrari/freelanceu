import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CreateGigDto } from './dto/create-gig.dto';
import { UpdateGigDto } from './dto/update-gig.dto';
import { GigEntity, GigSellerSnapshot } from './entities/gig.entity';

type SessionUser = {
    id: string;
    name: string;
    avatar: string;
    email?: string;
    role?: string;
};

@Injectable()
export class GigsService {
    private readonly gigs: GigEntity[] = this.loadInitialGigs();

    private loadInitialGigs(): GigEntity[] {
        const filePath = join(process.cwd(), 'src', 'gigs', 'data', 'gigs.json');
        const fileContents = readFileSync(filePath, 'utf8');

        return JSON.parse(fileContents) as GigEntity[];
    }

    create(dto: CreateGigDto, user: SessionUser): GigEntity {
        const gig = new GigEntity();
        gig.id = `g_${Math.random().toString(36).substr(2, 9)}`;
        gig.sellerId = user.id;
        gig.seller = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            email: user.email,
            role: 'freelancer',
        };
        gig.title = dto.title;
        gig.description = dto.description;
        gig.category = dto.category;
        gig.price = dto.price;
        gig.deliveryDays = dto.deliveryDays;
        gig.thumbnail = dto.thumbnail || 'https://picsum.photos/seed/default/400/300';
        gig.tags = dto.tags || [];
        gig.rating = 0;
        gig.totalReviews = 0;
        gig.createdAt = new Date().toISOString().split('T')[0];

        this.gigs.push(gig);
        // save to disk 
        const filePath = join(process.cwd(), 'src', 'gigs', 'data', 'gigs.json');
        try {
            const gigsToSave = JSON.stringify(this.gigs, null, 2);
            readFileSync(filePath, 'utf8'); // Check if file exists
            writeFileSync(filePath, gigsToSave, 'utf8');
        } catch (err) {
            console.error('Error saving gig to disk:', err);
        }
        return gig;
    }

    findAll(): GigEntity[] {
        return this.gigs;
    }

    findOne(id: string): GigEntity | undefined {
        return this.gigs.find(gig => gig.id === id);
    }

    findByUser(user: SessionUser): GigEntity[] {
        return this.gigs.filter(gig => gig.sellerId === user.id);
    }

    findByCategory(category: string): GigEntity[] {
        return this.gigs.filter(gig => gig.category === category);
    }

    update(id: string, dto: UpdateGigDto): GigEntity | undefined {
        const gig = this.findOne(id);
        if (!gig) {
            return undefined;
        }

        if (dto.title !== undefined) gig.title = dto.title;
        if (dto.description !== undefined) gig.description = dto.description;
        if (dto.category !== undefined) gig.category = dto.category;
        if (dto.price !== undefined) gig.price = dto.price;
        if (dto.deliveryDays !== undefined) gig.deliveryDays = dto.deliveryDays;
        if (dto.thumbnail !== undefined) gig.thumbnail = dto.thumbnail;
        if (dto.tags !== undefined) gig.tags = dto.tags;
        if (dto.rating !== undefined) gig.rating = dto.rating;
        if (dto.totalReviews !== undefined) gig.totalReviews = dto.totalReviews;

        return gig;
    }

    delete(id: string): boolean {
        const index = this.gigs.findIndex(gig => gig.id === id);
        if (index > -1) {
            this.gigs.splice(index, 1);
            return true;
        }
        return false;
    }

    getCategories(): string[] {
        const categories = new Set<string>();
        this.gigs.forEach(gig => categories.add(gig.category));
        return Array.from(categories);
    }
}
