import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class OrderLineInputDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  productId!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class OrderAddressInputDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  phone!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsString()
  city!: string;

  @ApiProperty()
  @IsString()
  street!: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderLineInputDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderLineInputDto)
  lines!: OrderLineInputDto[];

  @ApiProperty({ type: OrderAddressInputDto })
  @ValidateNested()
  @Type(() => OrderAddressInputDto)
  billing!: OrderAddressInputDto;

  @ApiPropertyOptional({ type: OrderAddressInputDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderAddressInputDto)
  shipping?: OrderAddressInputDto;

  @ApiProperty({ enum: ['addis-standard', 'addis-express', 'other-cities'] })
  @IsIn(['addis-standard', 'addis-express', 'other-cities'])
  shippingMethodId!: 'addis-standard' | 'addis-express' | 'other-cities';

  @ApiProperty({ enum: ['telebirr', 'cbe', 'cash'] })
  @IsIn(['telebirr', 'cbe', 'cash'])
  paymentMethod!: 'telebirr' | 'cbe' | 'cash';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  guestPhone?: string;
}
