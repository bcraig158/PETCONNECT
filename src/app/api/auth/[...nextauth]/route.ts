// src/app/api/auth/[...nextauth]/route.ts
export const runtime = 'nodejs'; // Use Node.js runtime for auth (argon2 requires it)

export { GET, POST } from '@/auth';

