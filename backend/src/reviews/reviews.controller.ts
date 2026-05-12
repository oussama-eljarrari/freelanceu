import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Session,
    UnauthorizedException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Post()
    create(@Body() payload: CreateReviewDto, @Session() session: any) {
        const user = session?.user;

        if (!user) {
            throw new UnauthorizedException('You must be signed in to leave a review');
        }

        if (!payload.gigId || payload.rating === undefined || !payload.comment) {
            throw new BadRequestException('Missing required review fields');
        }

        if (payload.rating < 1 || payload.rating > 5) {
            throw new BadRequestException('Rating must be between 1 and 5');
        }

        if (payload.comment.trim().length < 10) {
            throw new BadRequestException('Comment must be at least 10 characters');
        }

        const review = this.reviewsService.create(payload, user);
        return { message: 'Review created successfully', data: review };
    }

    @Get('gig/:gigId')
    findByGigId(@Param('gigId') gigId: string) {
        const reviews = this.reviewsService.findByGigId(gigId);
        return { data: reviews };
    }

    @Get()
    findAll() {
        const reviews = this.reviewsService.findAll();
        return { data: reviews };
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        const review = this.reviewsService.findOne(id);

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        return { data: review };
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Session() session: any) {
        const user = session?.user;

        if (!user) {
            throw new UnauthorizedException('You must be signed in to delete a review');
        }

        const review = this.reviewsService.findOne(id);

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        if (review.authorId !== user.id) {
            throw new UnauthorizedException('You can only delete your own reviews');
        }

        this.reviewsService.delete(id);
        return { message: 'Review deleted successfully' };
    }
}
