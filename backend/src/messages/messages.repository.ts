import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import type { MessageRecord } from './messages.service';

type MessageRow = {
  id: string;
  gig_id: string;
  sender_id: string | null;
  receiver_id: string;
  subject: string;
  body: string;
  created_at: string;
  sender_email: string;
  receiver_email: string;
  client_id: string | null;
  client_email: string;
};

type MessageInsert = {
  id: string;
  gigId: string;
  senderId: string | null;
  receiverId: string;
  subject: string;
  body: string;
  senderEmail: string;
  receiverEmail: string;
  clientId: string | null;
  clientEmail: string;
  createdAt: string;
};

@Injectable()
export class MessagesRepository {
  constructor(private readonly database: DatabaseService) {}

  create(message: MessageInsert): MessageRecord {
    this.database
      .connection()
      .prepare(
        `
            INSERT INTO messages (id, gig_id, sender_id, receiver_id, subject, body, sender_email, receiver_email, client_id, client_email, created_at)
            VALUES (@id, @gigId, @senderId, @receiverId, @subject, @body, @senderEmail, @receiverEmail, @clientId, @clientEmail, @createdAt)
        `,
      )
      .run(message);

    return this.toMessage({
      id: message.id,
      gig_id: message.gigId,
      sender_id: message.senderId,
      receiver_id: message.receiverId,
      subject: message.subject,
      body: message.body,
      sender_email: message.senderEmail,
      receiver_email: message.receiverEmail,
      client_id: message.clientId,
      client_email: message.clientEmail,
      created_at: message.createdAt,
    });
  }

  findAll(): MessageRecord[] {
    const rows = this.database
      .connection()
      .prepare('SELECT * FROM messages ORDER BY created_at DESC')
      .all() as MessageRow[];

    return rows.map((row) => this.toMessage(row));
  }

  findByUser(userId?: string, email?: string): MessageRecord[] {
    const rows = this.database
      .connection()
      .prepare(
        `
            SELECT * FROM messages
            WHERE sender_id = @userId
               OR receiver_id = @userId
               OR client_id = @userId
               OR sender_email = @email
               OR receiver_email = @email
               OR client_email = @email
            ORDER BY created_at DESC
        `,
      )
      .all({ userId: userId ?? null, email: email ?? null }) as MessageRow[];

    return rows.map((row) => this.toMessage(row));
  }

  private toMessage(row: MessageRow): MessageRecord {
    return {
      id: row.id,
      gigId: row.gig_id,
      sellerId: row.receiver_id,
      sellerEmail: row.receiver_email,
      clientId: row.client_id,
      clientEmail: row.client_email,
      senderId: row.sender_id,
      senderEmail: row.sender_email,
      subject: row.subject,
      body: row.body,
      createdAt: row.created_at,
    };
  }
}
