import { z } from 'zod';

export const authProviderSchema = z.enum(['email', 'google', 'apple']);

export const signInWithPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const signUpSchema = signInWithPasswordSchema.extend({
  displayName: z.string().min(1).max(80).optional()
});

export const sessionSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  expiresAt: z.number().int().positive(),
  userId: z.string().uuid(),
  email: z.string().email().optional()
});

export type Session = z.infer<typeof sessionSchema>;
