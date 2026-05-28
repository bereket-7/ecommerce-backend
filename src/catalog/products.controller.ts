import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ListProductsQueryDto } from './dto/list-products.query.dto';
import { PaginatedProductsDto } from './dto/paginated-products.dto';
import { ProductDto } from './product.mapper';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('facets')
  @ApiOkResponse({ description: 'Filter facet counts' })
  getFacets(@Query() query: ListProductsQueryDto) {
    return this.productsService.getFacets(query);
  }

  @Get()
  @ApiOkResponse({ type: PaginatedProductsDto })
  findAll(@Query() query: ListProductsQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':slug')
  @ApiOkResponse({ description: 'Product by slug' })
  findOne(@Param('slug') slug: string): Promise<ProductDto> {
    return this.productsService.findBySlug(slug);
  }
}
