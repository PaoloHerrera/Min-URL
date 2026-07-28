ALTER TABLE "short_urls" ALTER COLUMN "slug" SET DATA TYPE varchar(12);--> statement-breakpoint
ALTER TABLE "short_urls" ALTER COLUMN "original_url" SET DATA TYPE varchar(2048);--> statement-breakpoint
ALTER TABLE "short_urls" ALTER COLUMN "ip_address" SET DATA TYPE varchar(45);