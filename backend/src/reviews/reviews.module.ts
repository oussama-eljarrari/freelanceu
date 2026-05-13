import { Module } from '@nestjs/common';
import { OrdersModule } from 'src/orders/orders.module';
import { UsersModule } from 'src/users/users.module';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
    imports: [UsersModule, OrdersModule],
    controllers: [ReviewsController],
    providers: [ReviewsService],
    exports: [ReviewsService],
})
export class ReviewsModule { }
