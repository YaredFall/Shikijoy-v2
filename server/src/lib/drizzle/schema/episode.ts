import { pgTable, serial, numeric, text, varchar, timestamp, index } from "drizzle-orm/pg-core";

// ? Reference EpisodeRecord Dexie schema class from client folder
// animejoyID: string;
// index: number;
// label: string;
// player: string | undefined;
// studio: string | undefined;
// user: string;
export const users = pgTable('episodes', {
  id: serial('id').primaryKey(),
  animejoyID: varchar('animejoyID', { length: 10 }).notNull(),
  index: numeric('index').notNull(),
  label: text('label').notNull(),
  player: text('player'),
  studio: text('player'),
  user: text('player').notNull(),

  timestamp: timestamp('timestamp').defaultNow()
}, (table) => ({
  indexIdx: index("index_idx").on(table.index)
}));