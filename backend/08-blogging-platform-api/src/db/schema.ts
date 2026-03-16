import { sql, type SQL } from 'drizzle-orm';
import {
  customType,
  index,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

// https://betterstack.com/community/guides/scaling-nodejs/full-text-search-in-postgres-with-typescript/#introducing-postgresql-tsvector
// custom tsvector type for Drizzle
const tsvector = customType<{ data: string }>({
  dataType() {
    return 'tsvector';
  },
});

export const blogsTable = pgTable(
  'blogs',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content').notNull(),
    category: varchar('category', { length: 100 }),
    tags: text('tags').array(),

    // search vector combining title, content, and category, which will automatically update whenever changes happen
    searchVector: tsvector('search_vector').generatedAlwaysAs(
      (): SQL =>
        sql`to_tsvector('english',
          ${blogsTable.title} || ' ' ||
          ${blogsTable.content} || ' ' ||
          coalesce(${blogsTable.category}, '')
        )`,
    ),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    searchIndex: index('search_index').using('gin', table.searchVector),
  }),
);
