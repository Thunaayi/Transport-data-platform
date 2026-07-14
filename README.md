# Transport Data Platform

A transport data platform that syncs flight and bus information from external sources into a Postgres database (hosted on Supabase) and exposes it through a REST API for a Next.js frontend.

## Main idea

This project is split into two workspaces:

- `backend`: Express + Drizzle ORM backend that:
  - stores flights, buses, and airports in Postgres (Supabase)
  - syncs Pakistan airport schedule data from PAA JSON feeds
  - keeps AviationStack as a fallback source when PAA returns no usable rows
  - scrapes bus routes from mnzil.app
  - exposes REST API endpoints
- `frontend`: Next.js app that consumes the backend API and renders transport information.

## Repo structure

- `backend/`
  - `src/`: backend application code
  - `src/modules/flights/`: flight service, API fetcher, scraper, sync logic, routes, controllers
  - `src/modules/buses/`: bus scraper and service
  - `src/db/`: Drizzle schema, database connection, RLS policies
  - `drizzle/`: Drizzle migration files
  - `.env`: backend runtime config
- `frontend/`
  - `src/app/`: Next.js app pages
  - `src/components/`: reusable UI components
  - `src/lib/supabase.ts`: Supabase client helper
  - `src/utils/supabase/`: Supabase SSR clients (browser, server, middleware)
  - `.env.local`: frontend runtime config

## Prerequisites

- Node.js 20+
- npm
- A Supabase account (free tier works)

## Development setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Go to https://supabase.com/dashboard/projects
2. Click **New project**
3. Fill in: name, database password, region
4. After creation, go to **Project Settings → API**
5. Copy the **Project URL** and **anon public key**

### 3. Configure backend environment

Update `backend/.env`:

```env
# Connection pooler (recommended)
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres

# OR direct connection:
# DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres

AVIATIONSTACK_API_KEY=YOUR_API_KEY # optional fallback
```

### 4. Configure frontend environment

Update `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 5. Push schema to database

From the `backend/` directory:

```bash
npx drizzle-kit push
```

This creates all tables (transport_events, bus_routes, bus_stops, bus_route_stops, airports).

### 6. (Optional) Enable RLS and seed data

Run the SQL in `backend/src/db/rls.sql` via the Supabase SQL Editor to enable Row-Level Security.

Seed airports:

```bash
npm run seed:airports
```

### 7. Run backend and frontend

In separate terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

## Backend endpoints

- `GET /api/flights` - returns stored flights from Postgres
- `POST /api/flights/sync` - triggers a sync from external sources into the database
- `GET /api/flights/:id` - returns a single flight by ID
- `GET /api/buses` - returns all bus routes
- `GET /api/buses/:slug` - returns a single bus route with stops
- `POST /api/buses/sync` - triggers a bus route scrape from mnzil.app
- `GET /api/airports` - returns all airports
- `GET /api/airports/:iata` - returns a single airport

### Example sync request

```bash
curl -X POST "http://localhost:4000/api/flights/sync?critical=true"
```

## Database schema

| Table | Description |
|-------|-------------|
| `transport_events` | Flights synced from PAA/AviationStack |
| `bus_routes` | Bus routes scraped from mnzil.app |
| `bus_stops` | Individual bus stop locations |
| `bus_route_stops` | Junction table linking routes to stops (ordered) |
| `airports` | Airport reference data (180+ airports) |

## Useful commands

```bash
npm run dev:backend      # run backend in development mode
npm run dev:frontend     # run frontend in development mode
npm run db:up            # start local Postgres (Docker)
npm run db:down          # stop local Postgres
npm run seed:airports    # seed airport data
```

Backend-specific commands (run from `backend/`):

```bash
npm run db:push          # push schema to database
npm run db:generate      # generate new migration
npm run db:studio        # open Drizzle Studio
```

## Troubleshooting

- If the backend returns empty flight results, verify the database is accessible and `backend/.env` is configured.
- If sync fails on upsert, ensure the database has the unique constraint on `transport_events(number, scheduled_departure)`.
- If PAA fetching fails, verify network access to `https://paaconnectapi.paa.gov.pk/api/flights/`.
- For Supabase connection issues, try the connection pooler (port 6543) instead of direct connection.
