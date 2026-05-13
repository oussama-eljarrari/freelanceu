import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    Session,
    UnauthorizedException,
} from '@nestjs/common';
import { CreateGigDto } from './dto/create-gig.dto';
import { UpdateGigDto } from './dto/update-gig.dto';
import { GigsService } from './gigs.service';

@Controller('gigs')
export class GigsController {
    constructor(private readonly gigsService: GigsService) {}

    @Post()
    create(@Body() payload: CreateGigDto, @Session() session: any) {
        const user = session?.user;

        if (!user) {
            throw new UnauthorizedException('You must be signed in to create a gig');
        }

        const requiredFields = [
            payload.title,
            payload.description,
            payload.category,
            payload.price,
            payload.deliveryDays,
        ];

        if (requiredFields.some(value => value === undefined || value === null || value === '')) {
            throw new BadRequestException('Missing required gig fields');
        }

        if (payload.title.length < 40 || payload.title.length > 80) {
            throw new BadRequestException('Title must be between 40 and 80 characters');
        }

        if (payload.price < 5) {
            throw new BadRequestException('Price must be at least $5');
        }

        if (payload.deliveryDays < 1) {
            throw new BadRequestException('Delivery days must be at least 1');
        }

        const gig = this.gigsService.create(payload, user);
        return { message: 'Gig created successfully', data: gig };
    }

    @Get()
    findAll(@Query('category') category?: string, @Query('include') include?: string) {
        const includeList = parseInclude(include);
        let gigs = this.gigsService.findAll(includeList as any);
        if (category) {
            gigs = this.gigsService.findByCategory(category, includeList as any);
        }
        return { data: gigs };
    }

    @Get('categories/list')
    getCategories() {
        const categories = this.gigsService.getCategories();
        return { data: categories };
    }

    @Get('seller/my-gigs')
    findUserGigs(@Session() session: any, @Query('include') include?: string) {
        const user = session?.user;

        if (!user) {
            throw new UnauthorizedException('You must be signed in to view your gigs');
        }

        const gigs = this.gigsService.findByUser(user, parseInclude(include) as any);
        return { data: gigs };
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Query('include') include?: string) {
        const gig = this.gigsService.findOne(id, parseInclude(include) as any);

        if (!gig) {
            throw new NotFoundException('Gig not found');
        }

        return { data: gig };
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() payload: UpdateGigDto,
        @Session() session: any,
    ) {
        const user = session?.user;

        if (!user) {
            throw new UnauthorizedException('You must be signed in to update gigs');
        }

        const gig = this.gigsService.findOne(id);

        if (!gig) {
            throw new NotFoundException('Gig not found');
        }

        if (user.role !== 'admin' && gig.sellerId !== user.id) {
            throw new UnauthorizedException('You can only update your own gigs');
        }

        // Validation for optional title update
        if (payload.title && (payload.title.length < 40 || payload.title.length > 80)) {
            throw new BadRequestException('Title must be between 40 and 80 characters');
        }

        // Validation for optional price update
        if (payload.price !== undefined && payload.price < 5) {
            throw new BadRequestException('Price must be at least $5');
        }

        // Validation for optional deliveryDays update
        if (payload.deliveryDays !== undefined && payload.deliveryDays < 1) {
            throw new BadRequestException('Delivery days must be at least 1');
        }

        const updatedGig = this.gigsService.update(id, payload, ['seller', 'tags'] as any);

        if (!updatedGig) {
            throw new NotFoundException('Gig not found');
        }

        return { message: 'Gig updated successfully', data: updatedGig };
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Session() session: any) {
        const user = session?.user;

        if (!user) {
            throw new UnauthorizedException('You must be signed in to delete gigs');
        }

        const gig = this.gigsService.findOne(id);

        if (!gig) {
            throw new NotFoundException('Gig not found');
        }

        if (user.role !== 'admin' && gig.sellerId !== user.id) {
            throw new UnauthorizedException('You can only delete your own gigs');
        }

        const success = this.gigsService.delete(id);

        if (!success) {
            throw new NotFoundException('Gig not found');
        }

        return { message: 'Gig deleted successfully' };
    }
}

function parseInclude(include?: string): string[] {
    return include?.split(',').map((item) => item.trim()).filter(Boolean) ?? [];
}
