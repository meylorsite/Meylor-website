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

export const admissionApplicationSchema = z.object({
  packageId: z.string().optional(),
  packageName: z.string().optional(),
  parentInfo: z.object({
    parentName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    relationship: z.string().optional(),
    nationality: z.string().optional(),
    nationalId: z.string().optional(),
  }),
  studentInfo: z.object({
    studentNameEn: z.string().optional(),
    studentNameAr: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    currentGrade: z.string().optional(),
    previousSchool: z.string().optional(),
    medicalConditions: z.string().optional(),
  }),
  locale: z.string().optional(),
});
