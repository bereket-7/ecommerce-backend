# KitchenEdge API (`ecommerce-backend`)

NestJS + Prisma + PostgreSQL backend for the [KitchenEdge storefront](../ecommerce-template) (Next.js). This repository is a **v1 skeleton**: health checks, database wiring, and dev tooling only. Catalog, orders, auth, and payments come in later phases.

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

   Wait until the `postgres` healthcheck passes (`docker compose ps`).

2. **Environment**

   ```bash
   cp .env.example .env
   ```

3. **Install & generate Prisma client**

   ```bash
   npm install
   npx prisma generate
   ```

4. **Run the API (dev)**

   ```bash
   npm run start:dev
   ```

5. **Verify health**

   Liveness (always 200 if the process is up):

   ```bash
   curl http://localhost:4000/api/v1/health
   ```

   Readiness (503 when Postgres is unreachable):

   ```bash
   curl -i http://localhost:4000/api/v1/health/ready
   ```

   Example liveness response:

   ```json
   {
     "status": "ok",
     "timestamp": "2026-05-21T12:00:00.000Z",
     "database": "up"
   }
   ```

   If Postgres is not running, liveness still returns 200 with `"database": "down"`; readiness returns **503**.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run start:dev` | Watch mode (port from `PORT`, default 4000) |
| `npm run build` | Compile to `dist/` |
| `npm run start:prod` | Run compiled app |
| `npm run lint` | ESLint |
| `npm run test` | Unit tests |
| `npm run test:e2e` | E2E tests (health endpoint) |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run migrations (`prisma migrate dev`) |
| `npm run prisma:studio` | Prisma Studio UI |

## API surface (v1)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/health` | Liveness (always 200; includes DB status) |
| GET | `/api/v1/health/ready` | Readiness (503 if DB is down) |
| GET | `/api/docs` | Swagger UI |

### Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | (see `.env.example`) | PostgreSQL connection string |
| `PORT` | `4000` | HTTP port |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed origin(s), comma-separated |
| `NODE_ENV` | `development` | Runtime environment |

## Frontend integration (future)

The Next.js app lives in [`ecommerce-template`](../ecommerce-template). When wired, use:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

| Frontend today | Future backend |
|----------------|----------------|
| `src/components/Shop/shopData.ts` | `GET /api/v1/products` |
| `src/app/(site)/(pages)/products/[slug]/page.tsx` | `GET /api/v1/products/:slug` |
| Redux cart + checkout | `POST /api/v1/orders` |
| `src/lib/siteConfig.ts` (ETB, shipping) | Config service or API env |

**Money convention (planned):** ETB as integers (santim) or whole ETB with a documented API convention.

## Roadmap

1. **Catalog** — Prisma models, seed from `shopData`, products REST, Next.js fetch
2. **Orders** — `POST /orders`, shipping rules from `shippingOptions.ts`
3. **Auth** — JWT, addresses, order history
4. **Payments** — Telebirr / CBE webhooks, COD order state

**Phase 2 (not in v1):** Redis (sessions/cache), object storage, email, payment provider SDKs.

## Project layout

```
src/
├── main.ts              # Bootstrap entry
├── create-app.ts        # Shared app setup (CORS, prefix, Swagger)
├── app.module.ts
├── config/configuration.ts
├── prisma/              # PrismaModule + PrismaService
└── health/              # GET /api/v1/health
prisma/schema.prisma     # Placeholder (no models yet)
docker-compose.yml       # PostgreSQL 16
```

## License

UNLICENSED — private template.
