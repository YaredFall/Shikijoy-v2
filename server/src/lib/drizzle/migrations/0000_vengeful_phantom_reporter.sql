CREATE TABLE IF NOT EXISTS "episodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"animejoyID" varchar(10) NOT NULL,
	"index" numeric NOT NULL,
	"label" text NOT NULL,
	"player" text NOT NULL,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "index_idx" ON "episodes" ("index");