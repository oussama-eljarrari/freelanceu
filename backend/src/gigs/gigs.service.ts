import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateGigDto } from './dto/create-gig.dto';
import { UpdateGigDto } from './dto/update-gig.dto';
import { GigEntity } from './entities/gig.entity';
import { GigsRepository } from './gigs.repository';

type SessionUser = {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  role?: string;
};

type Include = 'seller' | 'tags' | 'reviews';

@Injectable()
export class GigsService {
  constructor(
    private readonly gigsRepository: GigsRepository,
    private readonly usersService: UsersService,
  ) { }

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
      tags: [],
      seller: undefined as any,
    };

    this.gigsRepository.create(gig, dto.tags ?? []);

    return this.findOne(gig.id, ['seller', 'tags']) as GigEntity;
  }

  findAll(include: Include[] = []): GigEntity[] {
    return this.hydrate(this.gigsRepository.findAll(), include);
  }

  findOne(id: string, include: Include[] = []): GigEntity | undefined {
    const gig = this.gigsRepository.findById(id);
    if (!gig) {
      return undefined;
    }

    return this.hydrate([gig], include)[0];
  }

  findByIds(ids: string[], include: Include[] = []): GigEntity[] {
    return this.hydrate(this.gigsRepository.findByIds(ids), include);
  }

  findByUser(user: SessionUser, include: Include[] = []): GigEntity[] {
    return this.hydrate(this.gigsRepository.findBySellerId(user.id), include);
  }

  findByCategory(category: string, include: Include[] = []): GigEntity[] {
    return this.hydrate(this.gigsRepository.findByCategory(category), include);
  }

  update(
    id: string,
    dto: UpdateGigDto,
    include: Include[] = [],
  ): GigEntity | undefined {
    const gig = this.findOne(id);
    if (!gig) {
      return undefined;
    }

    this.gigsRepository.update(
      id,
      {
        title: dto.title ?? gig.title,
        description: dto.description ?? gig.description,
        category: dto.category ?? gig.category,
        price: dto.price ?? gig.price,
        deliveryDays: dto.deliveryDays ?? gig.deliveryDays,
        thumbnail: dto.thumbnail ?? gig.thumbnail,
        rating: dto.rating ?? gig.rating,
        totalReviews: dto.totalReviews ?? gig.totalReviews,
      },
      dto.tags,
    );

    return this.findOne(id, include);
  }

  delete(id: string): boolean {
    return this.gigsRepository.delete(id);
  }

  getCategories(): string[] {
    return this.gigsRepository.getCategories();
  }

  private hydrate(gigs: GigEntity[], include: Include[]): GigEntity[] {
    if (gigs.length === 0) {
      return gigs;
    }

    const gigIds = gigs.map((gig) => gig.id);

    if (include.includes('seller')) {
      const sellers = this.usersService.publicUsers(
        gigs.map((gig) => gig.sellerId),
      );

      gigs.forEach((gig) => {
        const seller = sellers.find((row) => row.id === gig.sellerId);
        if (seller) {
          gig.seller = {
            id: seller.id,
            name: seller.name ?? '',
            avatar: seller.avatar ?? '',
            email: seller.email,
            role: seller.role,
          };
        }
      });
    }

    if (include.includes('tags')) {
      const tags = this.gigsRepository.findTagsByGigIds(gigIds);

      gigs.forEach((gig) => {
        gig.tags = tags
          .filter((tag) => tag.gigId === gig.id)
          .map((tag) => tag.name);
      });
    }

    if (include.includes('reviews')) {
      const reviews = this.gigsRepository.findReviewRelationsByGigIds(gigIds);

      gigs.forEach((gig) => {
        const gigReviews = reviews.filter((review) => review.gigId === gig.id);
        //calculate average rating and total reviews
        gig.rating =
          gigReviews.reduce(
            (sum, review) => sum + review.rating,
            0,
          ) /
          (gigReviews.length || 1);


        gig.totalReviews = gigReviews.length;
        (gig as GigEntity & { reviews?: unknown[] }).reviews = reviews
          .filter((review) => review.gigId === gig.id)
          .map((review) => ({
            id: review.id,
            orderId: review.orderId,
            gigId: review.gigId,
            authorId: review.authorId,
            author: {
              id: review.authorId,
              name: review.authorName,
              avatar: review.authorAvatar,
              email: review.authorEmail,
            },
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
          }));
      });
    }

    return gigs;
  }
}
