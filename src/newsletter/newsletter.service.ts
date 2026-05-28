import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscribeNewsletterDto } from './dto/subscribe.dto';

@Injectable()
export class NewsletterService {
  constructor(private readonly prisma: PrismaService) {}

  async subscribe(dto: SubscribeNewsletterDto) {
    try {
      const subscriber = await this.prisma.newsletterSubscriber.create({
        data: { email: dto.email.toLowerCase() },
      });
      return { id: subscriber.id, subscribed: true };
    } catch {
      throw new ConflictException('Email already subscribed');
    }
  }
}
