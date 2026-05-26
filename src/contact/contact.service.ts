import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContactDto) {
    const message = await this.prisma.contactMessage.create({
      data: dto,
    });

    this.logger.log(
      `Contact message from ${dto.name}: ${dto.subject} (${message.id})`,
    );

    return { id: message.id, received: true };
  }
}
