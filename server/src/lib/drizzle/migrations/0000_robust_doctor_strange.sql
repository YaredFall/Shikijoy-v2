CREATE TABLE IF NOT EXISTS "watch_stamps" (
	"id" serial PRIMARY KEY NOT NULL,
	"animejoy_anime_id" varchar(8) NOT NULL,
	"shikimori_user_id" integer,
	"animejoy_user_id" integer,
	"src" text NOT NULL,
	"created_at" varchar(24) NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "animejoy_anime_id_idx" ON "watch_stamps" ("animejoy_anime_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shikimori_user_id_idx" ON "watch_stamps" ("shikimori_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "animejoy_user_id_idx" ON "watch_stamps" ("animejoy_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "src_idx" ON "watch_stamps" ("src");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "animejoy_user_id_and_src_idx" ON "watch_stamps" ("animejoy_anime_id","src");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "watch_stamps" ("created_at");