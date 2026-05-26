import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ShippingMethodId } from '@prisma/client';

export type ShippingMethodDto = {
  id: string;
  title: string;
  price: number;
  note: string;
};

const SHIPPING_OPTIONS: Omit<ShippingMethodDto, 'price'>[] = [
  {
    id: 'addis-standard',
    title: 'Addis Ababa — Standard',
    note: 'Free on orders over threshold ETB',
  },
  {
    id: 'addis-express',
    title: 'Addis Ababa — Express',
    note: 'Same-day in select areas',
  },
  {
    id: 'other-cities',
    title: 'Other cities',
    note: 'Adama, Hawassa, Bahir Dar, Dire Dawa & more',
  },
];

const BASE_PRICES: Record<string, number> = {
  'addis-standard': 0,
  'addis-express': 250,
  'other-cities': 450,
};

@Injectable()
export class ShippingService {
  constructor(private readonly configService: ConfigService) {}

  getMethods(subtotal: number): ShippingMethodDto[] {
    const threshold = this.configService.get<number>(
      'shipping.freeThreshold',
      4000,
    );

    return SHIPPING_OPTIONS.map((option) => ({
      ...option,
      price: this.getShippingPrice(
        option.id as 'addis-standard' | 'addis-express' | 'other-cities',
        subtotal,
        threshold,
      ),
      note:
        option.id === 'addis-standard'
          ? `Free on orders over ${threshold.toLocaleString()} ETB`
          : option.note,
    }));
  }

  getShippingPrice(
    methodId: 'addis-standard' | 'addis-express' | 'other-cities',
    subtotal: number,
    threshold?: number,
  ): number {
    const freeThreshold =
      threshold ??
      this.configService.get<number>('shipping.freeThreshold', 4000);

    if (methodId === 'addis-standard' && subtotal >= freeThreshold) {
      return 0;
    }

    return BASE_PRICES[methodId] ?? 0;
  }

  toPrismaShippingMethodId(methodId: string): ShippingMethodId {
    const map: Record<string, ShippingMethodId> = {
      'addis-standard': ShippingMethodId.addis_standard,
      'addis-express': ShippingMethodId.addis_express,
      'other-cities': ShippingMethodId.other_cities,
    };

    const mapped = map[methodId];
    if (!mapped) {
      throw new Error(`Invalid shipping method: ${methodId}`);
    }
    return mapped;
  }

  fromPrismaShippingMethodId(method: ShippingMethodId): string {
    const map: Record<ShippingMethodId, string> = {
      [ShippingMethodId.addis_standard]: 'addis-standard',
      [ShippingMethodId.addis_express]: 'addis-express',
      [ShippingMethodId.other_cities]: 'other-cities',
    };
    return map[method];
  }
}
