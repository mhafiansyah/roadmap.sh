import { DATABASE_URL } from '@/config/env.js';
import { blogsTable } from '@/db/schema.js';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle(DATABASE_URL!);

export const addPost = async (
  title: string,
  content: string,
  category?: string,
  tags?: string[],
) => {
  if (!title || !content) {
    return;
  }
  const newPost: typeof blogsTable.$inferInsert = {
    title,
    content,
    category,
    tags,
  };

  return db.insert(blogsTable).values(newPost).returning();
};

export const updatePost = async (
  post_id: number,
  title: string,
  content: string,
  category?: string,
  tags?: string[],
) => {
  if (!title || !content) {
    return 400;
  }

  const newPostData = {
    title,
    content,
    category,
    tags,
  };

  const [updatedPost] = await db
    .update(blogsTable)
    .set(newPostData)
    .where(eq(blogsTable.id, post_id))
    .returning();

  return updatedPost ?? null;
};

export const deletePost = async (post_id: number) => {
  const [deletedPost] = await db
    .delete(blogsTable)
    .where(eq(blogsTable.id, post_id))
    .returning({ id: blogsTable.id });

  return deletedPost;
};

export const getSinglePost = async (post_id: number) => {
  const { searchVector, ...columnsToSelect } = getTableColumns(blogsTable);
  const [singlePost] = await db
    .select(columnsToSelect)
    .from(blogsTable)
    .where(eq(blogsTable.id, post_id));

  return singlePost ?? null;
};

export const getAllPosts = async () => {
  const { searchVector, ...columnsToSelect } = getTableColumns(blogsTable);
  const posts = await db.select(columnsToSelect).from(blogsTable);
  return posts;
};

export const searchPosts = async (query: string) => {
  const startTime = performance.now();

  // destructure columns to exclude searchVector field from the table
  const { searchVector, ...columnsToSelect } = getTableColumns(blogsTable);

  const results = await db
    .select(columnsToSelect)
    .from(blogsTable)
    .where(
      sql`${blogsTable.searchVector} @@ plainto_tsquery('english', ${query})`,
    );

  const endTime = performance.now();
  const searchTime = (endTime - startTime).toFixed(2);

  return { results, searchTime };
};
