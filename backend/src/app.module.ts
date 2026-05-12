import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';
import { OrdersModule } from './orders/orders.module';
import { GigsModule } from './gigs/gigs.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [UsersModule, AuthModule, MessagesModule, OrdersModule, GigsModule, ReviewsModule],
  controllers: [AppController],
  providers: [AppService, UsersService],
})
export class AppModule { }
