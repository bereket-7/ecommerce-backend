import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

type AuthRequest = Request & { user: { userId: string } };

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  me(@Req() req: AuthRequest) {
    return this.authService.getProfile(req.user.userId);
  }
}

@ApiTags('addresses')
@Controller('addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AddressesController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  list(@Req() req: AuthRequest) {
    return this.authService.listAddresses(req.user.userId);
  }

  @Post()
  create(@Req() req: AuthRequest, @Body() dto: CreateAddressDto) {
    return this.authService.createAddress(req.user.userId, dto);
  }

  @Patch(':id')
  update(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.authService.updateAddress(req.user.userId, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.authService.deleteAddress(req.user.userId, id);
  }
}
