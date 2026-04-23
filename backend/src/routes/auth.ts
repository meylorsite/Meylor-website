import { Router, Request, Response } from 'express';
import User from '../models/User';
import AdmissionApplication from '../models/AdmissionApplication';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { validate } from '../middleware/validate';
import { loginSchema, refreshSchema } from '../validators/auth';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Login
router.post(
  '/login',
  validate(loginSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });


    user.refreshTokens.push(refreshToken);
    // Keep only the last 5 refresh tokens
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    await user.save();

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
    });
  })
);

// Refresh token
router.post(
  '/refresh',
  validate(refreshSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    // Rotate refresh token
   
router.post(
  '/logout',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const user = req.user;

    if (refreshToken) {
      user.refreshTokens = user.refreshTokens.filter((t: string) => t !== refreshToken);
    } else {
      user.refreshTokens = [];

  '/change-password',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);



    res.json({
      success: true,
      data: { accessToken, refreshToken },
      message: 'Password changed successfully',
    });
  })
);

// Update profile
router.put(
  '/profile',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const allowedFields = ['nameEn', 'nameAr', 'phone', 'nationality', 'nationalId', 'avatarUrl', 'children'];
    const updates: Record<string, any> = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

      .sort({ createdAt: -1 })
      .select('-adminNotes')
      .lean();

    res.json({ success: true, data });
  })
);

export default router;
