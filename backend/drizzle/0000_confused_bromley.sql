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
	"status" varchar(50) DEFAULT 'scheduled' NOT NULL,
	"source" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
