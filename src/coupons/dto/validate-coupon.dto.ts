import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, Min } from 'class-validator';

export class ValidateCouponDto {
  @ApiProperty({ example: 'ADDIS25' })
  @IsString()
  code!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  subtotal!: number;
}
