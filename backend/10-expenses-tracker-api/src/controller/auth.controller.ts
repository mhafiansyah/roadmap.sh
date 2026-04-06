import { db } from '@/db/db.js';
import { usersTable } from '@/db/schema/users.js';
import { eq } from 'drizzle-orm';
import type { Request, Response } from 'express';
import * as argon2 from 'argon2';
import { generateToken, verifyToken } from '@/services/jwt.services.js';

export const authLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username));

    if (!user || !(await argon2.verify(user.password, password))) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const tokens = await generateToken(user);

    return res.status(200).json({ message: 'Login Success!', ...tokens });
  } catch (error) {
    return res.status(500).json({ message: 'Server Internal Error', error });
  }
};

export const authRegister = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await argon2.hash(password);

    const [user] = await db
      .insert(usersTable)
      .values({
        username,
        password: hashedPassword,
      })
      .returning({ id: usersTable.id });

    return res.status(201).json({ message: 'User Created' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Server Internal Error', error });
  }
};

export const authRefresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    const decoded = await verifyToken(refreshToken, 'refresh');

    if (!decoded || !decoded.sub) {
      return res
        .status(401)
        .json({ message: 'Invalid or expired refresh token' });
    }

    const userId = parseInt(decoded.sub);

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const tokens = await generateToken(user);

    return res.status(200).json({ message: 'Token Refreshed!', ...tokens });
  } catch (error) {
    return res.status(500).json({ message: 'Server Internal Error', error });
  }
};
