CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text,
	"username" text,
	"password" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gameInstance" (
	"gameId" serial PRIMARY KEY NOT NULL,
	"adminId" integer,
	"taxCoefficient" double precision,
	"maxPlayers" integer,
	"finePercent" double precision,
	"roundNumber" integer,
	"auditProbability" double precision,
	"kickPlayersOnBankruptcy" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player" (
	"playerId" serial PRIMARY KEY NOT NULL,
	"gameId" integer,
	"playerName" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "playerRound" (
	"roundId" integer PRIMARY KEY NOT NULL,
	"universeId" integer,
	"playerId" integer,
	"income" integer,
	"declaredIncome" integer,
	"isAudited" boolean,
	"isFined" boolean,
	"totalAssets" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roundInstance" (
	"roundId" serial PRIMARY KEY NOT NULL,
	"gameId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "universe" (
	"universeId" serial PRIMARY KEY NOT NULL,
	"gameId" integer,
	"ministerId" integer,
	"universeName" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "universeRound" (
	"roundId" integer PRIMARY KEY NOT NULL,
	"universeId" integer,
	"taxRate" integer,
	"moneyPool" integer,
	"distributedTaxReturns" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gameInstance" ADD CONSTRAINT "gameInstance_adminId_users_id_fk" FOREIGN KEY ("adminId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player" ADD CONSTRAINT "player_gameId_gameInstance_gameId_fk" FOREIGN KEY ("gameId") REFERENCES "public"."gameInstance"("gameId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "playerRound" ADD CONSTRAINT "playerRound_roundId_roundInstance_roundId_fk" FOREIGN KEY ("roundId") REFERENCES "public"."roundInstance"("roundId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "playerRound" ADD CONSTRAINT "playerRound_universeId_universe_universeId_fk" FOREIGN KEY ("universeId") REFERENCES "public"."universe"("universeId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "playerRound" ADD CONSTRAINT "playerRound_playerId_player_playerId_fk" FOREIGN KEY ("playerId") REFERENCES "public"."player"("playerId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roundInstance" ADD CONSTRAINT "roundInstance_gameId_gameInstance_gameId_fk" FOREIGN KEY ("gameId") REFERENCES "public"."gameInstance"("gameId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "universe" ADD CONSTRAINT "universe_gameId_gameInstance_gameId_fk" FOREIGN KEY ("gameId") REFERENCES "public"."gameInstance"("gameId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "universeRound" ADD CONSTRAINT "universeRound_roundId_roundInstance_roundId_fk" FOREIGN KEY ("roundId") REFERENCES "public"."roundInstance"("roundId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "universeRound" ADD CONSTRAINT "universeRound_universeId_universe_universeId_fk" FOREIGN KEY ("universeId") REFERENCES "public"."universe"("universeId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
