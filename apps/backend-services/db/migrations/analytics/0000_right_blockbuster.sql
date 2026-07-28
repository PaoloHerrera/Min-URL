CREATE TABLE "visits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"short_url_id" uuid NOT NULL,
	"ip_address" varchar(45) NOT NULL,
	"user_agent" varchar(512) NOT NULL,
	"referer" varchar(2048) NOT NULL,
	"referer_domain" varchar(255) NOT NULL,
	"browser" varchar(50) NOT NULL,
	"os" varchar(50) NOT NULL,
	"device" varchar(50) NOT NULL,
	"geolocation" jsonb,
	"visited_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_short_url_id_short_urls_id_fk" FOREIGN KEY ("short_url_id") REFERENCES "public"."short_urls"("id") ON DELETE cascade ON UPDATE no action;