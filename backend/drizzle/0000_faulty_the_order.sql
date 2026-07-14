CREATE TABLE "airports" (
	"iata_code" varchar(10) PRIMARY KEY NOT NULL,
	"icao_code" varchar(10),
	"name" varchar(255) NOT NULL,
	"city" varchar(100),
	"country" varchar(100) NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"timezone" varchar(50),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bus_route_stops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"route_id" uuid NOT NULL,
	"stop_id" uuid NOT NULL,
	"stop_order" integer NOT NULL,
	CONSTRAINT "bus_route_stops_route_id_stop_id_unique" UNIQUE("route_id","stop_id")
);
--> statement-breakpoint
CREATE TABLE "bus_routes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(100) NOT NULL,
	"formal_name" text,
	"image" varchar(200),
	"type_id" integer,
	"source" varchar(50) DEFAULT 'mnzil' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "bus_routes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "bus_stops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mnzil_id" integer,
	"slug" varchar(200) NOT NULL,
	"name_english" varchar(200) NOT NULL,
	"latitude" double precision,
	"longitude" double precision,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "bus_stops_mnzil_id_unique" UNIQUE("mnzil_id"),
	CONSTRAINT "bus_stops_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "transport_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar(50) NOT NULL,
	"number" varchar(50) NOT NULL,
	"origin" varchar(50) NOT NULL,
	"destination" varchar(50) NOT NULL,
	"scheduled_departure" timestamp NOT NULL,
	"scheduled_arrival" timestamp NOT NULL,
	"actual_departure" timestamp,
	"actual_arrival" timestamp,
	"direction" varchar(20) DEFAULT 'unknown' NOT NULL,
	"status" varchar(50) DEFAULT 'scheduled' NOT NULL,
	"source" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "transport_events_number_scheduled_departure_unique" UNIQUE("number","scheduled_departure")
);
--> statement-breakpoint
ALTER TABLE "bus_route_stops" ADD CONSTRAINT "bus_route_stops_route_id_bus_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."bus_routes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bus_route_stops" ADD CONSTRAINT "bus_route_stops_stop_id_bus_stops_id_fk" FOREIGN KEY ("stop_id") REFERENCES "public"."bus_stops"("id") ON DELETE cascade ON UPDATE no action;