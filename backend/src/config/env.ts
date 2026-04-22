import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  ADMIN_EMAIL: z.string().default('admin@meylor.sa'),
  ADMIN_PASSWORD: z.string().default('ChangeMe123!'),
});

export const validateEnv = () => {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('Environment validation failed:', parsed.error.flatten().fieldErrors);
    process.exit(1);
  }
  return parsed.data;
};

export type Env = z.infer<typeof envSchema>;
