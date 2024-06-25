ALTER TABLE "gameInstance" ADD COLUMN "isDeleted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "player" ADD COLUMN "consent" boolean;