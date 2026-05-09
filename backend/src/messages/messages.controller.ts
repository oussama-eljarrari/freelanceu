import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
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
    findByUser(
        @Query('userId') userId?: string,
        @Query('email') email?: string,
    ) {
        const data = this.messagesService.findByUser(userId, email);
        return { data };
    }
}
