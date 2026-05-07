import { pgTable, uuid, varchar, timestamp, unique } from 'drizzle-orm/pg-core';

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
  status: varchar('status', { length: 50 }).notNull().default('scheduled'), // on_time, delayed, cancelled, etc.
  source: varchar('source', { length: 50 }).notNull(), // api, scrape, user
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  unq: unique().on(t.number, t.scheduledDeparture),
}));
