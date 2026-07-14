import { pgTable, uuid, varchar, timestamp, unique, text, doublePrecision, integer } from 'drizzle-orm/pg-core';

export const transportEvents = pgTable('transport_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: varchar('type', { length: 50 }).notNull(), // 'flight'
  number: varchar('number', { length: 50 }).notNull(), // e.g. PK303
  origin: varchar('origin', { length: 50 }).notNull(), // KHI
  destination: varchar('destination', { length: 50 }).notNull(), // LHE
  scheduledDeparture: timestamp('scheduled_departure').notNull(),
  scheduledArrival: timestamp('scheduled_arrival').notNull(),
  actualDeparture: timestamp('actual_departure'),
  actualArrival: timestamp('actual_arrival'),
  direction: varchar('direction', { length: 20 }).notNull().default('unknown'), // departure, arrival, unknown
  status: varchar('status', { length: 50 }).notNull().default('scheduled'), // on_time, delayed, cancelled, etc.
  source: varchar('source', { length: 50 }).notNull(), // api, scrape, user
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  unq: unique().on(t.number, t.scheduledDeparture),
}));

// Bus routes scraped from mnzil.app
export const busRoutes = pgTable('bus_routes', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(), // e.g. R-01
  name: varchar('name', { length: 100 }).notNull(),          // e.g. R-01
  formalName: text('formal_name'),                           // e.g. Route 1 (Model Colony to Dockyard)
  image: varchar('image', { length: 200 }),                  // image filename
  typeId: integer('type_id'),                                // 1 = bus, 4 = minibus, etc.
  source: varchar('source', { length: 50 }).notNull().default('mnzil'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Individual bus stop locations
export const busStops = pgTable('bus_stops', {
  id: uuid('id').defaultRandom().primaryKey(),
  mnzilId: integer('mnzil_id').unique(),                     // original mnzil ID
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  nameEnglish: varchar('name_english', { length: 200 }).notNull(),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Ordered junction table: which stops belong to which route
export const busRouteStops = pgTable('bus_route_stops', {
  id: uuid('id').defaultRandom().primaryKey(),
  routeId: uuid('route_id').notNull().references(() => busRoutes.id, { onDelete: 'cascade' }),
  stopId: uuid('stop_id').notNull().references(() => busStops.id, { onDelete: 'cascade' }),
  stopOrder: integer('stop_order').notNull(),
}, (t) => ({
  unqRouteStop: unique().on(t.routeId, t.stopId),
}));

export const airports = pgTable('airports', {
  iataCode: varchar('iata_code', { length: 10 }).primaryKey(),
  icaoCode: varchar('icao_code', { length: 10 }),
  name: varchar('name', { length: 255 }).notNull(),
  city: varchar('city', { length: 100 }),
  country: varchar('country', { length: 100 }).notNull(),
  latitude: doublePrecision('latitude').notNull(),
  longitude: doublePrecision('longitude').notNull(),
  timezone: varchar('timezone', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
});
