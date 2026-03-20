import { db } from '@/db/index.js';
import { usersTable } from '@/db/schema.js';
import { signToken } from '@/services/jwt.services.js';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import type { Request, Response } from 'express';

export const authRegister = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning({ id: usersTable.id });

    const token = signToken({ userId: user?.id });

    return res.status(201).json({ message: 'User created', token });
  } catch (err: any) {
    if (err.cause.code === '23505') {
      return res.status(400).json({ message: 'Email already registered' });
    }
    return res.status(400).json({ message: 'Registration failed', err });
  }
};

export const authLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken({ userId: user?.id });

    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: 'Login Failed' });
  }
};
