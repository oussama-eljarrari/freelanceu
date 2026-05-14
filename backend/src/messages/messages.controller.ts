import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post()
  create(@Body() payload: CreateMessageDto) {
    const message = this.messagesService.create({
      gigId: payload.gigId,
      sellerId: payload.sellerId,
      sellerEmail: payload.sellerEmail,
      clientId: payload.clientId ?? null,
      clientEmail: payload.clientEmail,
      senderId: payload.senderId ?? null,
      senderEmail: payload.senderEmail,
      subject: payload.subject,
      body: payload.message,
    });

    return { message: 'Message sent', data: message };
  }

  @Get()
  findByUser(@CurrentUser() user, @Query('email') email?: string) {
    const data = this.messagesService.findAll(user.id, email);
    return { data };
  }
}
