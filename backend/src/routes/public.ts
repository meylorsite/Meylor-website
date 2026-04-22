import { Router, Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { validate } from '../middleware/validate';
import {
  contactMessageSchema,
  complaintTicketSchema,
  jobApplicationSchema,
  newsletterSchema,
  admissionApplicationSchema,
} from '../validators/public';
import { generateTicketNumber } from '../utils/ticketNumber';
import { verifyAccessToken } from '../utils/jwt';
import {
  SiteSettings,
  Section,
  Program,
  Facility,
  Testimonial,
  NewsPost,
  GalleryActivity,
  JourneyItem,
  PricingPackage,
  JobPost,
  JobApplication,
  AdmissionApplication,
  ContactMessage,
  ComplaintTicket,
  NewsletterSubscriber,
  StatCounter,
  FAQ,
  TeamMember,
  User,
} from '../models';

// Optional auth: attaches req.user if a valid Bearer token is provided, but doesn't reject otherwise
const optionalAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return next();
  try {
    const token = h.split(' ')[1];
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId);
    if (user) req.user = user;
  } catch {
    // ignore invalid tokens for public routes
  }
  next();
};

const router = Router();

// ─── Site Settings ──────────────────────────────────────────────
router.get(
  '/settings',
  asyncHandler(async (_req: Request, res: Response) => {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.json({ success: true, data: settings });
  })
);

// ─── Sections ────────────────────────────────────────────────────
router.get(
  '/sections',
  asyncHandler(async (req: Request, res: Response) => {
    const filter: any = { isVisible: true };
    if (req.query.page) filter.page = req.query.page;
    const data = await Section.find(filter).sort('order');
    res.json({ success: true, data });
  })
);

// ─── Programs ────────────────────────────────────────────────────
router.get(
  '/programs',
  asyncHandler(async (_req: Request, res: Response) => {
    const data = await Program.find({ isVisible: true }).sort('order');
    res.json({ success: true, data });
  })
);

router.get(
  '/programs/:slug',
  asyncHandler(async (req: Request, res: Response) => {
    const data = await Program.findOne({ slug: req.params.slug, isVisible: true });
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  })
);

// ─── Facilities ──────────────────────────────────────────────────
router.get(
  '/facilities',
  asyncHandler(async (_req: Request, res: Response) => {
    const data = await Facility.find({ isVisible: true }).sort('order');
    res.json({ success: true, data });
  })
);

// ─── Testimonials ────────────────────────────────────────────────
router.get(
  '/testimonials',
  asyncHandler(async (_req: Request, res: Response) => {
    const data = await Testimonial.find({ isVisible: true, isApproved: true }).sort('order -createdAt');
    res.json({ success: true, data });
  })
);

// Public review submission — requires admin approval before going live
router.post(
  '/testimonials',
  optionalAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { nameEn, nameAr, roleEn, roleAr, contentEn, contentAr, rating, avatarUrl, email } = req.body || {};

    if (!nameEn || !contentEn) {
      throw new ApiError(400, 'Name and content are required');
    }
    if (String(contentEn).trim().length < 10) {
      throw new ApiError(400, 'Review content must be at least 10 characters');
    }

    const doc = await Testimonial.create({
      nameEn: String(nameEn).trim(),
      nameAr: nameAr ? String(nameAr).trim() : '',
      roleEn: roleEn ? String(roleEn).trim() : '',
      roleAr: roleAr ? String(roleAr).trim() : '',
      contentEn: String(contentEn).trim(),
      contentAr: contentAr ? String(contentAr).trim() : '',
      avatarUrl: avatarUrl ? String(avatarUrl).trim() : '',
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      isApproved: false,
      isVisible: true,
      submittedBy: req.user?._id,
      submitterEmail: email ? String(email).trim() : (req.user?.email || ''),
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review will appear after approval.',
      data: { id: doc._id },
    });
  })
);

// ─── News Posts ──────────────────────────────────────────────────
router.get(
  '/news',
  asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      NewsPost.find({ isPublished: true }).sort('-publishedAt').skip(skip).limit(limit),
      NewsPost.countDocuments({ isPublished: true }),
    ]);

    res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  })
);

router.get(
  '/news/:slug',
  asyncHandler(async (req: Request, res: Response) => {
    const data = await NewsPost.findOne({ slug: req.params.slug, isPublished: true });
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  })
);

// ─── Gallery Activities ─────────────────────────────────────────
router.get(
  '/gallery',
  asyncHandler(async (_req: Request, res: Response) => {
    const data = await GalleryActivity.find({ isVisible: true }).sort('order').select('-media');
    res.json({ success: true, data });
  })
);

router.get(
  '/gallery/:slug',
  asyncHandler(async (req: Request, res: Response) => {
    const data = await GalleryActivity.findOne({ slug: req.params.slug, isVisible: true });
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  })
);

// ─── Journey Items ──────────────────────────────────────────────
router.get(
  '/journey',
  asyncHandler(async (_req: Request, res: Response) => {
    const data = await JourneyItem.find({ isVisible: true }).sort('order');
    res.json({ success: true, data });
  })
);

// ─── Pricing Packages ───────────────────────────────────────────
router.get(
  '/pricing',
  asyncHandler(async (_req: Request, res: Response) => {
    const data = await PricingPackage.find({ isVisible: true }).sort('order');
    res.json({ success: true, data });
  })
);

// ─── FAQs ───────────────────────────────────────────────────────
router.get(
  '/faqs',
  asyncHandler(async (req: Request, res: Response) => {
    const filter: any = { isVisible: true };
    if (req.query.category) filter.category = req.query.category;
    const data = await FAQ.find(filter).sort('order');
    res.json({ success: true, data });
  })
);

// ─── Team Members ──────────────────────────────────────────────
router.get(
  '/team',
  asyncHandler(async (req: Request, res: Response) => {
    const filter: any = { isVisible: true };
    if (req.query.category) filter.category = req.query.category;
    const data = await TeamMember.find(filter).sort('order');
    res.json({ success: true, data });
  })
);

router.get(
  '/team/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const data = await TeamMember.findOne({ _id: req.params.id, isVisible: true });
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  })
);

// ─── Job Posts ───────────────────────────────────────────────────
router.get(
  '/jobs',
  asyncHandler(async (_req: Request, res: Response) => {
    const data = await JobPost.find({ isOpen: true }).sort('-createdAt');
    res.json({ success: true, data });
  })
);

router.get(
  '/jobs/:slug',
  asyncHandler(async (req: Request, res: Response) => {
    const data = await JobPost.findOne({ slug: req.params.slug, isOpen: true });
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  })
);

// ─── Stat Counters ──────────────────────────────────────────────
router.get(
  '/stats',
  asyncHandler(async (_req: Request, res: Response) => {
    const data = await StatCounter.find({ isVisible: true }).sort('order');
    res.json({ success: true, data });
  })
);

// ─── Contact Message (public submit) ────────────────────────────
router.post(
  '/contact',
  validate(contactMessageSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const msg = await ContactMessage.create(req.body);
    res.status(201).json({ success: true, data: { id: msg._id }, message: 'Message sent successfully' });
  })
);

// ─── Complaint Ticket (public submit) ───────────────────────────
router.post(
  '/complaints',
  validate(complaintTicketSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const ticketNumber = generateTicketNumber();
    const ticket = await ComplaintTicket.create({ ...req.body, ticketNumber });
    res.status(201).json({
      success: true,
      data: { ticketNumber: ticket.ticketNumber },
      message: 'Complaint submitted successfully',
    });
  })
);

// ─── Job Application (public submit) ────────────────────────────
router.post(
  '/applications',
  validate(jobApplicationSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const app = await JobApplication.create(req.body);
    res.status(201).json({ success: true, data: { id: app._id }, message: 'Application submitted successfully' });
  })
);

// ─── Admission Application (public submit) ─────────────────────
router.post(
  '/admissions',
  optionalAuth,
  validate(admissionApplicationSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { packageId, packageName, parentInfo, studentInfo, locale } = req.body;

    const doc = await AdmissionApplication.create({
      packageId: packageId || undefined,
      packageName: packageName || '',
      parentName: parentInfo.parentName,
      parentEmail: parentInfo.email,
      parentPhone: parentInfo.phone,
      relationship: parentInfo.relationship || '',
      nationality: parentInfo.nationality || '',
      nationalId: parentInfo.nationalId || '',
      studentNameEn: studentInfo.studentNameEn || '',
      studentNameAr: studentInfo.studentNameAr || '',
      dateOfBirth: studentInfo.dateOfBirth ? new Date(studentInfo.dateOfBirth) : undefined,
      gender: studentInfo.gender || '',
      currentGrade: studentInfo.currentGrade || '',
      previousSchool: studentInfo.previousSchool || '',
      medicalConditions: studentInfo.medicalConditions || '',
      locale: locale || 'en',
      submittedBy: req.user?._id,
    });

    res.status(201).json({ success: true, data: { id: doc._id }, message: 'Application submitted successfully' });
  })
);

// ─── Newsletter Subscribe (public) ──────────────────────────────
router.post(
  '/newsletter',
  validate(newsletterSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
      }
      return res.json({ success: true, message: 'Subscribed successfully' });
    }
    await NewsletterSubscriber.create({ email });
    res.status(201).json({ success: true, message: 'Subscribed successfully' });
  })
);

export default router;
