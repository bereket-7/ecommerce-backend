import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateContactDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  subject!: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  phone!: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  message!: string;
}
