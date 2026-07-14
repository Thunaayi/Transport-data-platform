-- =============================================
-- Row-Level Security (RLS) Policies
-- Run this after migrations are applied
-- =============================================

-- Enable RLS on all tables
ALTER TABLE transport_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_route_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE airports ENABLE ROW LEVEL SECURITY;

-- Transport events: everyone can read (anon + authenticated)
CREATE POLICY "transport_events_select"
  ON transport_events FOR SELECT
  TO anon, authenticated
  USING (true);

-- Transport events: only service_role can write
CREATE POLICY "transport_events_insert"
  ON transport_events FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "transport_events_update"
  ON transport_events FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "transport_events_delete"
  ON transport_events FOR DELETE
  TO service_role
  USING (true);

-- Bus routes: everyone can read
CREATE POLICY "bus_routes_select"
  ON bus_routes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "bus_routes_insert"
  ON bus_routes FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "bus_routes_update"
  ON bus_routes FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "bus_routes_delete"
  ON bus_routes FOR DELETE
  TO service_role
  USING (true);

-- Bus stops: everyone can read
CREATE POLICY "bus_stops_select"
  ON bus_stops FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "bus_stops_insert"
  ON bus_stops FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "bus_stops_update"
  ON bus_stops FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "bus_stops_delete"
  ON bus_stops FOR DELETE
  TO service_role
  USING (true);

-- Bus route stops: everyone can read
CREATE POLICY "bus_route_stops_select"
  ON bus_route_stops FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "bus_route_stops_insert"
  ON bus_route_stops FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "bus_route_stops_update"
  ON bus_route_stops FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "bus_route_stops_delete"
  ON bus_route_stops FOR DELETE
  TO service_role
  USING (true);

-- Airports: everyone can read
CREATE POLICY "airports_select"
  ON airports FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "airports_insert"
  ON airports FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "airports_update"
  ON airports FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "airports_delete"
  ON airports FOR DELETE
  TO service_role
  USING (true);
