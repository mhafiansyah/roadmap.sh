import { DATABASE_URL } from '@/config/env.js';
import { drizzle } from 'drizzle-orm/node-postgres';
import { blogsTable } from '@/db/schema.js';
import { sql } from 'drizzle-orm';

const main = async () => {
  const db = drizzle(DATABASE_URL!);

  // Clean start
  await db.execute(sql`TRUNCATE TABLE blogs RESTART IDENTITY CASCADE`);

  const dummyPosts: (typeof blogsTable.$inferInsert)[] = [
    {
      title: 'My First Blog Post',
      content: 'This is the content of my first blog post.',
      category: 'Technology',
      tags: ['Tech', 'Programming'],
    },
    {
      title: 'Getting Started with PostgreSQL FTS',
      content:
        'PostgreSQL full-text search is powerful and much faster than using ILIKE for large datasets.',
      category: 'Databases',
      tags: ['Postgres', 'SQL', 'Search'],
    },
    {
      title: 'Drizzle ORM for TypeScript',
      content:
        'Drizzle is a lightweight ORM that lets you write SQL with TypeScript types.',
      category: 'Programming',
      tags: ['TypeScript', 'ORM', 'Drizzle'],
    },
    {
      title: 'The Future of Web Development',
      content:
        'Web development is evolving rapidly with modern frameworks and faster builds.',
      category: 'Technology',
      tags: ['Web', 'Frontend', 'Trends'],
    },
    {
      title: 'Healthy Lifestyle Tips',
      content:
        'Maintaining a balanced diet and regular exercise is the key to a healthy life.',
      category: 'Health',
      tags: ['Fitness', 'Nutrition', 'Wellness'],
    },
  ];

  await db.insert(blogsTable).values(dummyPosts);
  console.log('Successfully seeded 5 posts!');
  process.exit(0); // Exit properly after seeding
};

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
