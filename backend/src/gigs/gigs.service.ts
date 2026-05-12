import { Injectable } from '@nestjs/common';
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
    private readonly gigs: GigEntity[] = [
        {
            id: 'g1',
            sellerId: 'u1',
            seller: {
                id: 'u1',
                name: 'Sara Malik',
                avatar: 'https://i.pravatar.cc/150?img=47',
                email: 'sara@example.com',
                role: 'freelancer',
            },
            title: 'I will design a professional logo for your brand',
            description: 'High quality logo design with unlimited revisions. Delivered in PNG, SVG, and AI formats. Includes brand color palette.',
            category: 'Graphic Design',
            price: 50,
            deliveryDays: 3,
            rating: 4.8,
            totalReviews: 12,
            thumbnail: 'https://picsum.photos/seed/logo/400/300',
            tags: ['logo', 'branding', 'design'],
            createdAt: '2025-03-15',
        },
        {
            id: 'g2',
            sellerId: 'u2',
            seller: {
                id: 'u2',
                name: 'Karim Benali',
                avatar: 'https://i.pravatar.cc/150?img=12',
                email: 'karim@example.com',
                role: 'freelancer',
            },
            title: 'I will build a React web app with NestJS backend',
            description: 'Full-stack development with clean code, REST API, and deployment. Includes authentication and database setup.',
            category: 'Development',
            price: 300,
            deliveryDays: 14,
            rating: 5,
            totalReviews: 8,
            thumbnail: 'https://picsum.photos/seed/dev/400/300',
            tags: ['react', 'nestjs', 'fullstack'],
            createdAt: '2025-02-20',
        },
        {
            id: 'g3',
            sellerId: 'u1',
            seller: {
                id: 'u1',
                name: 'Sara Malik',
                avatar: 'https://i.pravatar.cc/150?img=47',
                email: 'sara@example.com',
                role: 'freelancer',
            },
            title: 'I will create social media graphics for your business',
            description: 'Eye-catching posts and stories for Instagram, Facebook, and LinkedIn. Delivered in all required sizes.',
            category: 'Graphic Design',
            price: 30,
            deliveryDays: 2,
            rating: 4.9,
            totalReviews: 15,
            thumbnail: 'https://picsum.photos/seed/social/400/300',
            tags: ['social-media', 'graphics', 'instagram'],
            createdAt: '2025-03-10',
        },
    ];

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
