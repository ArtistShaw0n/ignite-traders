ALTER TABLE "products" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "badge" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "sku" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "material" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "usage_area" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "bulk_supply" text NOT NULL;