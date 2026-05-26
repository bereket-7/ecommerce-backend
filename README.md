# KitchenEdge API (`ecommerce-backend`)

NestJS + Prisma + PostgreSQL backend for the [KitchenEdge storefront](../ecommerce-template) (Next.js).

## Stack

| Piece | Version |
|-------|---------|
| Node | 20 LTS recommended |
| NestJS | 11 |
| Prisma | 6 |
| PostgreSQL | 16 (Docker) |

## Prerequisites

- Node.js 20+
- npm
- Docker & Docker Compose

## Quick start

1. **Start PostgreSQL**

   ```bash
   docker compose up -d
   ```

2. **Environment**

   ```bash
   cp .env.example .env
   ```

3. **Install, migrate, seed**

   ```bash
   npm install
   npx prisma migrate deploy
   npm run prisma:seed
   ```

4. **Run the API (dev)**

   ```bash
   npm run start:dev
   ```

5. **Verify**

   ```bash
   curl http://localhost:4000/api/v1/health
   curl http://localhost:4000/api/v1/products
   ```

   Swagger UI: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

## API surface

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/health` | — | Liveness |
| GET | `/api/v1/health/ready` | — | Readiness |
| GET | `/api/v1/categories` | — | Shop categories |
| GET | `/api/v1/products` | — | List/search/filter products |
| GET | `/api/v1/products/facets` | — | Filter facet counts |
| GET | `/api/v1/products/:slug` | — | Product detail |
| GET | `/api/v1/products/:slug/reviews` | — | Product reviews |
| POST | `/api/v1/products/:slug/reviews` | optional | Add review |
| GET | `/api/v1/shipping/methods?subtotal=` | — | Shipping options + prices |
| POST | `/api/v1/orders` | optional | Create order |
| GET | `/api/v1/orders` | JWT | List user orders |
| GET | `/api/v1/orders/:id` | optional | Order detail |
| PATCH | `/api/v1/orders/:id/status` | — | Update order status |
| POST | `/api/v1/auth/register` | — | Register |
| POST | `/api/v1/auth/login` | — | Login (JWT) |
| GET | `/api/v1/auth/me` | JWT | Profile |
| GET/POST/PATCH/DELETE | `/api/v1/addresses` | JWT | Address book |
| GET/POST/DELETE | `/api/v1/wishlist` | JWT | Wishlist |
| POST | `/api/v1/coupons/validate` | — | Validate coupon |
| POST | `/api/v1/contact` | — | Contact form |
| POST | `/api/v1/newsletter/subscribe` | — | Newsletter |
| POST | `/api/v1/payments/initiate` | — | Stub Telebirr/CBE redirect |
| POST | `/api/v1/payments/webhooks/telebirr` | — | Payment webhook stub |
| POST | `/api/v1/payments/webhooks/cbe` | — | Payment webhook stub |

**Money:** prices are whole **ETB** integers (e.g. `8500`), matching the frontend catalog.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run start:dev` | Watch mode (port from `PORT`, default 4000) |
| `npm run build` | Compile to `dist/` |
| `npm run start:prod` | Run compiled app |
| `npm run prisma:migrate` | Run migrations (`prisma migrate dev`) |
| `npm run prisma:seed` | Seed categories, products, ADDIS25 coupon |
| `npm run test:e2e` | E2E tests |

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | (see `.env.example`) | PostgreSQL connection |
| `PORT` | `4000` | HTTP port |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed origin(s) |
| `JWT_SECRET` | — | JWT signing secret |
| `JWT_EXPIRES_IN` | `7d` | JWT expiry |
| `SHIPPING_FREE_THRESHOLD` | `4000` | Free Addis standard shipping (ETB) |
| `NODE_ENV` | `development` | Runtime environment |

## Frontend integration

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

Use `Authorization: Bearer <token>` for protected routes.

## License

UNLICENSED — private template.
