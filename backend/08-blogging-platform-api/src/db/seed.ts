import { DATABASE_URL } from '@/config/env.js';
import { drizzle } from 'drizzle-orm/node-postgres';
import { blogsTable } from '@/db/schema.js';

const db = drizzle(DATABASE_URL!);

const main = async () => {
  const blog: typeof blogsTable.$inferInsert = {
    title: 'My First Blog Post',
    content: 'This is the content of my first blog post.',
    category: 'Technology',
    tags: ['Tech', 'Programming'],
  };

  await db.insert(blogsTable).values(blog);
  console.log('New Post Created!');

  // const blogs = await db.select().from(blogsTable);
  // console.log(`Getting all blogs from the database: `, blogs);
};

main();
