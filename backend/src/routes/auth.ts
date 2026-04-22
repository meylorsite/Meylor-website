import { Router, Request, Response } from 'express';
import User from '../models/User';
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

    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Account is deactivated');
    }

    const accessToken = generateAccessToken({ userId: user._id.toString(), role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id.toString(), role: user.role });

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
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);

    const newAccessToken = generateAccessToken({ userId: user._id.toString(), role: user.role });
    const newRefreshToken = generateRefreshToken({ userId: user._id.toString(), role: user.role });

    user.refreshTokens.push(newRefreshToken);
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    await user.save();

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  })
);

// Logout
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
    }
    await user.save();

    res.json({ success: true, message: 'Logged out successfully' });
  })
);

// Get current user
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    res.json({ success: true, data: req.user.toJSON() });
  })
);

// Change password
router.put(
  '/change-password',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user || !(await user.comparePassword(currentPassword))) {
      throw new ApiError(400, 'Current password is incorrect');
    }

    user.password = newPassword;
    user.refreshTokens = [];
    await user.save();

    const accessToken = generateAccessToken({ userId: user._id.toString(), role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id.toString(), role: user.role });
    user.refreshTokens.push(refreshToken);
    await user.save();

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

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.json({ success: true, data: user.toJSON() });
  })
);

export default router;
