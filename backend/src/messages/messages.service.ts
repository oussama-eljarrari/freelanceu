import { Injectable } from '@nestjs/common';

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
    private readonly messages: MessageRecord[] = [];

    create(payload: Omit<MessageRecord, 'id' | 'createdAt'>): MessageRecord {
        const message: MessageRecord = {
            id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            createdAt: new Date().toISOString(),
            ...payload,
        };

        this.messages.unshift(message);
        return message;
    }

    findByUser(userId?: string, email?: string): MessageRecord[] {
        if (!userId && !email) {
            return this.messages;
        }

        return this.messages.filter((message) => {
            const matchesUser = userId
                ? message.senderId === userId || message.sellerId === userId || message.clientId === userId
                : false;
            const matchesEmail = email
                ? message.senderEmail === email || message.sellerEmail === email || message.clientEmail === email
                : false;
            return matchesUser || matchesEmail;
        });
    }
}
