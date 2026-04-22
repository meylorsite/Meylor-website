import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  nameEn: z.string().min(1),
  nameAr: z.string().min(1),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR']).optional(),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});
