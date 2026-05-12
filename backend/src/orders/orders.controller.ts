import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Patch, Post, Session, UnauthorizedException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';
import { OrderStatus } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    create(@Body() payload: CreateOrderDto, @Session() session: any) {
        const user = session?.user;

        if (!user) {
            throw new UnauthorizedException('You must be signed in to create an order');
        }

        const requiredFields = [
            payload.gigId,
            payload.gigTitle,
            payload.gigDescription,
            payload.gigThumbnail,
            payload.freelancerId,
            payload.freelancerName,
            payload.freelancerAvatar,
            payload.price,
            payload.requirements,
        ];

        if (requiredFields.some((value) => value === undefined || value === null || value === '')) {
            throw new BadRequestException('Missing required order fields');
        }

        const data = this.ordersService.create(payload, user);
        return { message: 'Order created', data };
    }

    @Get()
    findAll(@Session() session: any) {
        const user = session?.user;

        if (!user) {
            throw new UnauthorizedException('You must be signed in to view orders');
        }

        const data = this.ordersService.findForUser(user);
        return { data, stats: this.ordersService.getStatusCounts(data) };
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Session() session: any) {
        const user = session?.user;

        if (!user) {
            throw new UnauthorizedException('You must be signed in to view orders');
        }

        const order = this.ordersService.findOne(id);

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (user.role !== 'admin' && order.clientId !== user.id && order.freelancerId !== user.id) {
            throw new UnauthorizedException('You cannot access this order');
        }

        return { data: order };
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() payload: UpdateOrderDto, @Session() session: any) {
        const user = session?.user;

        if (!user) {
            throw new UnauthorizedException('You must be signed in to update orders');
        }

        const order = this.ordersService.findOne(id);

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (user.role !== 'admin' && order.freelancerId !== user.id) {
            throw new UnauthorizedException('Only the assigned freelancer can update this order');
        }

        if (payload.status && !this.isValidStatus(payload.status)) {
            throw new BadRequestException('Invalid order status');
        }

        const data = this.ordersService.update(id, payload);

        if (!data) {
            throw new NotFoundException('Order not found');
        }

        return { message: 'Order updated', data };
    }

    private isValidStatus(status: string): status is OrderStatus {
        return ['pending', 'in_progress', 'delivered', 'completed', 'cancelled'].includes(status);
    }
}