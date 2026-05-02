import { config as dotenv } from 'dotenv';
import { z } from 'zod';

dotenv();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  OPENAI_API_KEY: z.string().min(1),
  GOOGLE_PLACES_API_KEY: z.string().min(1)
});

export const env = envSchema.parse(process.env);
