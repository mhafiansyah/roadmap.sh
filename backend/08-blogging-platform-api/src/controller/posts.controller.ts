import { DATABASE_URL } from '@/config/env.js';
import { blogsTable } from '@/db/schema.js';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { redisClient } from '@/services/redis.services.js';

const db = drizzle(DATABASE_URL!);

export const addPost = async (
  title: string,
  content: string,
  category?: string,
  tags?: string[],
) => {
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

  // DELETE REDIS CACHE IF EXISTS
  if (updatedPost) {
    const cacheKey = `posts:${post_id}`;
    await redisClient
      .del(cacheKey)
      .catch((err) => console.error('[updatePost] Redis Delete Error: ', err));
  }

  return updatedPost ?? null;
};

export const deletePost = async (post_id: number) => {
  const [deletedPost] = await db
    .delete(blogsTable)
    .where(eq(blogsTable.id, post_id))
    .returning({ id: blogsTable.id });

  // DELETE REDIS CACHE IF EXISTS
  if (deletedPost) {
    const cacheKey = `posts:${post_id}`;
    await redisClient
      .del(cacheKey)
      .catch((err) => console.error('[DeletePost] Redis Delete Error: ', err));
  }

  return deletedPost;
};

export const getSinglePost = async (post_id: number) => {
  // REDIS CACHING
  const cacheKey = `posts:${post_id}`;

  try {
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return { ...JSON.parse(cachedData), cache: true };
    }
  } catch (error) {
    console.error('[getSinglePost] Redis Get Error (Get/Parse):', error);
    // Delete caching, if it was a parse error, the key might be corrupted
    await redisClient
      .del(cacheKey)
      .catch((err) => console.error('[getSingelPost] Redis Del Error:', err));
  }

  // FETCH FROM DB IF THERE IS NO CACHE
  const { searchVector, ...columnsToSelect } = getTableColumns(blogsTable);
  const [singlePost] = await db
    .select(columnsToSelect)
    .from(blogsTable)
    .where(eq(blogsTable.id, post_id));

  if (singlePost) {
    try {
      await redisClient.setEx(cacheKey, 5 * 60, JSON.stringify(singlePost));
    } catch (error) {
      console.error('[getSinglePost] Redis Set Error:', error);
    }
  }

  return singlePost ? { ...singlePost, cache: false } : null;
};

export const getAllPosts = async (page: number = 1, limit: number = 2) => {
  const offset = (page - 1) * limit;

  const { searchVector, ...columnsToSelect } = getTableColumns(blogsTable);
  const posts = await db
    .select(columnsToSelect)
    .from(blogsTable)
    .limit(limit)
    .offset(offset);

  const [totalCountResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(blogsTable);

  const totalItem = Number(totalCountResult?.count || 0);

  return {
    posts,
    pagination: {
      page,
      limit,
      totalItem,
      totalPages: Math.ceil(totalItem / limit),
    },
  };
};

export const searchPosts = async (
  query: string,
  page: number = 1,
  limit: number = 2,
) => {
  const startTime = performance.now();
  const offset = (page - 1) * limit;

  // destructure columns to exclude searchVector field from the table
  const { searchVector, ...columnsToSelect } = getTableColumns(blogsTable);
  const searchConditions = sql`${blogsTable.searchVector} @@ plainto_tsquery('english', ${query})`;

  const results = await db
    .select(columnsToSelect)
    .from(blogsTable)
    .where(searchConditions)
    .limit(limit)
    .offset(offset);

  const [totalCountResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(blogsTable)
    .where(searchConditions);

  const totalItem = Number(totalCountResult?.count || 0);
  const endTime = performance.now();
  const searchTime = (endTime - startTime).toFixed(2);

  return {
    results,
    searchTime,
    pagination: {
      page,
      limit,
      totalItem,
      totalPages: Math.ceil(totalItem / limit),
    },
  };
};
