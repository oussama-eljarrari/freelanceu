export class CreateMessageDto {
  gigId: string;
  sellerId: string;
  sellerEmail: string;
  clientId: string | null;
  clientEmail: string;
  senderId?: string | null;
  senderEmail: string;
  subject: string;
  message: string;
}
