import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: ['pending', 'processing', 'delivered', 'cancelled'],
  })
  @IsIn(['pending', 'processing', 'delivered', 'cancelled'])
  status!: 'pending' | 'processing' | 'delivered' | 'cancelled';
}
