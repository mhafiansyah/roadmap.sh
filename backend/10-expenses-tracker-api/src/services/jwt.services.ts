import { JWT_REFRESH_SECRET, JWT_SECRET } from '@/config/env.js';
import type { SelectUser } from '@/db/schema/users.js';
import * as jose from 'jose';
import { randomUUID } from 'node:crypto';

const alg = 'HS256';
const REFRESH_SECRET = new TextEncoder().encode(JWT_REFRESH_SECRET);
const SECRET = new TextEncoder().encode(JWT_SECRET);

const ISSUER = 'expenses-tracker-api';
const AUDIENCE = 'expenses-tracker-client';

export const generateToken = async (user: SelectUser) => {
  const payload = {
    name: user.name || user.username,
  };

  const refreshToken = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg })
    .setSubject(user.id.toString())
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setJti(randomUUID()) // Unique identifier for revocation
    .setIssuedAt()
    .setExpirationTime('3h')
    .sign(REFRESH_SECRET);

  const accessToken = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg })
    .setSubject(user.id.toString())
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setJti(randomUUID())
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(SECRET);

  return { accessToken, refreshToken };
};

export const verifyToken = async (
  token: string,
  type: 'access' | 'refresh',
) => {
  try {
    const type_secret = type === 'access' ? SECRET : REFRESH_SECRET;

    const { payload } = await jose.jwtVerify(token, type_secret, {
      issuer: ISSUER,
      audience: AUDIENCE,
      algorithms: [alg],
      requiredClaims: ['sub', 'jti'],
    });

    return payload;
  } catch (error) {
    return null;
  }
};
