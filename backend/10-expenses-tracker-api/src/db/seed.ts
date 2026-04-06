import * as argon2 from 'argon2';
import { db } from './db.js';
import { usersTable } from './schema/users.js';
import { expenseTable, categories } from './schema/expenses.js';
import { sql } from 'drizzle-orm';

async function seed() {
  try {
    console.log('Cleaning existing data and resetting IDs...');
    // Truncate both tables and restart their identity (ID) sequences
    await db.execute(
      sql`TRUNCATE TABLE ${usersTable}, ${expenseTable} RESTART IDENTITY CASCADE`,
    );

    console.log('Seeding 3 users...');

    const userData = [
      { username: 'johndoe', password: 'password123', name: 'John Doe' },
      { username: 'janedoe', password: 'securepassword', name: 'Jane Doe' },
      { username: 'bobsmith', password: 'anotherpassword', name: 'Bob Smith' },
    ];

    const userIds: number[] = [];

    for (const user of userData) {
      const hashedPassword = await argon2.hash(user.password);
      
      const [insertedUser] = await db.insert(usersTable).values({
        ...user,
        password: hashedPassword,
      }).onConflictDoUpdate({
        target: usersTable.username,
        set: { password: hashedPassword, name: user.name }
      }).returning({ id: usersTable.id });

      if (insertedUser) userIds.push(insertedUser.id);
    }

    console.log(`Successfully seeded/updated ${userIds.length} users.`);
    console.log('Seeding 10 expenses per user...');

    for (const userId of userIds) {
      const expenses: (typeof expenseTable.$inferInsert)[] = Array.from({
        length: 10,
      }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i * 2); // Spread dates over the last 20 days

        const category =
          categories[Math.floor(Math.random() * categories.length)];
        const dateStr = date.toISOString().split('T')[0];

        if (!category || !dateStr) throw new Error('Failed to generate seed data');

        return {
          userId,
          description: `Expense ${i + 1} for user ${userId}`,
          amount: (Math.random() * 100 + 5).toFixed(2), // Random amount between 5 and 105
          category: category,
          date: dateStr,
        };
      });

      await db.insert(expenseTable).values(expenses);
    }

    console.log('Successfully seeded 10 expenses per user!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
