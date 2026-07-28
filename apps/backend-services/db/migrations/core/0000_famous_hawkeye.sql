CREATE TABLE "short_urls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"original_url" text NOT NULL,
	"title" text DEFAULT 'Untitled' NOT NULL,
	"purpose" text DEFAULT 'direct' NOT NULL,
	"clicks_count" integer DEFAULT 0 NOT NULL,
	"password_hash" text,
	"ip_address" text NOT NULL,
	"geolocation" jsonb,
	"expiration_date" timestamp with time zone,
	"expired_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "short_urls_slug_unique" UNIQUE("slug")
);
