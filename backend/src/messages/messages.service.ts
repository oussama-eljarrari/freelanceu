import { Injectable } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';

export type MessageRecord = {
  id: string;
  gigId: string;
  sellerId: string;
  sellerEmail: string;
  clientId: string | null;
  clientEmail: string;
  senderId: string | null;
  senderEmail: string;
  subject: string;
  body: string;
  createdAt: string;
};

@Injectable()
export class MessagesService {
  constructor(private readonly messagesRepository: MessagesRepository) { }

  create(payload: Omit<MessageRecord, 'id' | 'createdAt'>): MessageRecord {
    const message = {
      id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      gigId: payload.gigId,
      senderId: payload.senderId,
      receiverId: payload.sellerId,
      subject: payload.subject,
      body: payload.body,
      senderEmail: payload.senderEmail,
      receiverEmail: payload.sellerEmail,
      clientId: payload.clientId,
      clientEmail: payload.clientEmail,
      createdAt: new Date().toISOString(),
    };

    return this.messagesRepository.create(message);
  }

  findAll(userId: string, email?: string): MessageRecord[] {
    if (!email) {
      return this.messagesRepository.findByUser(userId);
    }

    return this.messagesRepository.findByUser(userId, email);
  }
}
