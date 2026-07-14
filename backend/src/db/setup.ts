/**
 * One-time setup script for a new Supabase project.
 *
 * Usage:
 *   1. Update backend/.env with your new Supabase DATABASE_URL
 *   2. Run: npm run db:push   (pushes the Drizzle schema)
 *   3. Run: npx tsx src/scripts/seedAirports.ts  (seeds airports)
 *   4. Run the SQL in src/db/rls.sql against your Supabase DB
 *      (via Supabase SQL Editor or psql)
 *
 * Or use the full migration approach:
 *   1. npm run db:generate  (already done — see drizzle/0000_faulty_the_order.sql)
 *   2. Apply the migration manually or via drizzle-kit migrate
 *   3. Run the seed + RLS scripts
 */

console.log('See the comments above for setup instructions.');
