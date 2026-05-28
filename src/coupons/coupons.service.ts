import { Injectable } from '@nestjs/common';
import { DiscountType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type CouponValidationResult = {
  valid: boolean;
  discountAmount: number;
  code?: string;
};

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  async validate(
    code: string,
    subtotal: number,
  ): Promise<CouponValidationResult> {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.active) {
      return { valid: false, discountAmount: 0 };
    }

    if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
      return { valid: false, discountAmount: 0 };
    }

    let discountAmount = 0;
    if (coupon.discountType === DiscountType.percent) {
      discountAmount = Math.floor((subtotal * coupon.value) / 100);
    } else {
      discountAmount = Math.min(coupon.value, subtotal);
    }

    return {
      valid: true,
      discountAmount,
      code: coupon.code,
    };
  }
}
