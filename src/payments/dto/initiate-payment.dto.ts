import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class InitiatePaymentDto {
  @ApiProperty()
  @IsString()
  orderId!: string;

  @ApiProperty({ enum: ['telebirr', 'cbe'] })
  @IsIn(['telebirr', 'cbe'])
  provider!: 'telebirr' | 'cbe';
}
