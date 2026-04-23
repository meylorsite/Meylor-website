import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import * as crud from '../controllers/crudFactory';
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

const router = Router();

// All admin routes require authentication
router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'));

// ─── Site Settings (singleton) ──────────────────────────────────
router.get(
  '/settings',
  asyncHandler(async (_req: Request, res: Response) => {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.json({ success: true, data: settings });
  })
);



// ─── Users (SUPER_ADMIN only) ───────────────────────────────────
router.get('/users', authorize('SUPER_ADMIN'), crud.getAll(User));
router.get('/users/:id', authorize('SUPER_ADMIN'), crud.getOne(User));
router.post(
  '/users',
  authorize('SUPER_ADMIN'),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, nameEn, nameAr, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) throw new ApiError(409, 'Email already exists');
    const user = await User.create({ email, password, nameEn, nameAr, role });
    res.status(201).json({ success: true, data: user.toJSON() });
  })
);
router.put(
  '/users/:id',
  authorize('SUPER_ADMIN'),

router.get('/sections', crud.getAll(Section));
router.get('/sections/:id', crud.getOne(Section));
router.post('/sections', crud.createOne(Section));
router.put('/sections/:id', crud.updateOne(Section));
router.delete('/sections/:id', crud.deleteOne(Section));
router.put('/sections-reorder', crud.reorder(Section));

// ─── Programs ────────────────────────────────────────────────────
router
router.put('/testimonials-reorder', crud.reorder(Testimonial));

// ─── News Posts ──────────────────────────────────────────────────
router.get('/news', crud.getAll(NewsPost));
router.get('/news/:id', crud.getOne(NewsPost));
router.post('/news', crud.createOne(NewsPost));
router.put('/news/:id', crud.updateOne(NewsPost));
router.delete('/news/:id', crud.deleteOne(NewsPost));

// ─── Gallery Activities ─────────────────────────────────────────
router.get('/gallery', crud.getAll(GalleryActivity));
router.get('/gallery/:id', crud.getOne(GalleryActivity));
router.post('/gallery', crud.createOne(GalleryActivity));
router.put('/gallery/:id', crud.updateOne(GalleryActivity));
router.delete('/gallery/:id', crud.deleteOne(GalleryActivity));
router.put('/gallery-reorder', crud.reorder(GalleryActivity));

// ─── Journey Items ──────────────────────────────────────────────
router.get('/journey', crud.getAll(JourneyItem));
router.get('/journey/:id', crud.getOne(JourneyItem));
router.post
router.put('/pricing/:id', crud.updateOne(PricingPackage));
router.delete('/pricing/:id', crud.deleteOne(PricingPackage));
router.put('/pricing-reorder', crud.reorder(PricingPackage));

// ─── Job Posts ───────────────────────────────────────────────────
router.get('/jobs', crud.getAll(JobPost));
router.get('/jobs/:id', crud.getOne(JobPost));
router.post('/jobs', crud.createOne(JobPost));
router.put('/jobs/:id', crud.updateOne(JobPost));
router.delete('/jobs/:id', crud.deleteOne(JobPost));

// ─── Job Applications ───────────────────────────────────────────
router.get(
  '/applications',
  asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const filter: any = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.jobPost) filter.jobPost = req.query.jobPost;

    const [data, total] = await Promise.all([
      JobApplication.find(filter).populate('jobPost', 'titleEn titleAr').sort('-createdAt').skip(skip).limit(limit),
      JobApplication.countDocuments(filter),
    ]);

    res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  })
router.get('/complaints/:id', crud.getOne(ComplaintTicket));
router.put('/complaints/:id', crud.updateOne(ComplaintTicket));
router.delete('/complaints/:id', crud.deleteOne(ComplaintTicket));

// ─── Newsletter Subscribers ─────────────────────────────────────
router.get('/newsletter', crud.getAll(NewsletterSubscriber));
router.delete('/newsletter/:id', crud.deleteOne(NewsletterSubscriber));

// ─── FAQs ───────────────────────────────────────────────────────
router.get('/faqs', crud.getAll(FAQ));
router.get('/faqs/:id', crud.getOne(FAQ));
router.post('/faqs', crud.createOne(FAQ));
router.put('/faqs/:id', crud.updateOne(FAQ));
router.delete('/faqs/:id', crud.deleteOne(FAQ));
router.put('/faqs-reorder', crud.reorder(FAQ));

// ─── Stat Counters ──────────────────────────────────────────────
router.get('/stats', crud.getAll(StatCounter));
router.get('/stats/:id', crud.getOne(StatCounter));
router.post('/stats', crud.createOne(StatCounter));
router.put('/stats/:id', crud.updateOne(StatCounter));
router.delete('/stats/:id', crud.deleteOne(StatCounter));
router.put('/stats-reorder', crud.reorder(StatCounter));

// ─── Team Members ──────────────────────────────────────────────
router.get('/team', crud.getAll(TeamMember));
router.get('/team/:id', crud.getOne(TeamMember));
router.post('/team', crud.createOne(TeamMember));
router.put('/team/:id', crud.updateOne(TeamMember));
router.delete('/team/:id', crud.deleteOne(TeamMember));
router.put('/team-reorder', crud.reorder(TeamMember));

// ─── Dashboard Stats ────────────────────────────────────────────
router.get(
  '/dashboard',
  asyncHandler(async (_req: Request, res: Response) => {
    const [
      totalContacts,
      unreadContacts,
      totalComplaints,
      openComplaints,
      totalParents,
      totalUsers,
      recentContacts,
      recentComplaints,
      recentApplications,
      recentAdmissions,
      recentNews,
    ] = await Promise.all([
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ isRead: false }),
      ComplaintTicket.countDocuments(),
      ComplaintTicket.countDocuments({ status: 'open' }),
      JobApplication.countDocuments(),
      JobApplication.countDocuments({ status: 'pending' }),
      AdmissionApplication.countDocuments(),
      AdmissionApplication.countDocuments({ status: 'pending' }),
      NewsletterSubscriber.countDocuments({ isActive: true }),
      NewsPost.countDocuments(),
blishedAt imageUrl').lean(),
    ]);

    res.json({
      success: true,
      data: {
        totalContacts,
        unreadContacts,
        totalComplaints,
        openComplaints,

        totalTeam,
        totalStudents,
        totalParents,
        totalUsers,
        recentContacts,
        recentComplaints,
        recentApplications,
        recentAdmissions,
        recentNews,
      },
    });
  })
);

export default router;
