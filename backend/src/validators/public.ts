import { z } from 'zod';

export const contactMessageSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1),
});

export const complaintTicketSchema = z.object({
  category: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  details: z.string().min(1),
  attachmentLink: z.string().optional(),
});

export const jobApplicationSchema = z.object({
  jobPost: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  yearsOfExperience: z.number().min(0).optional(),
  message: z.string().optional(),
  cvLink: z.string().url(),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
});
