import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from '../product.mapper';

export class PaginatedProductsDto {
  @ApiProperty({ type: [Object] })
  data!: ProductDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  totalPages!: number;
}
