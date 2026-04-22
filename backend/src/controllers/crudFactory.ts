import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

export const getAll = (Model: Model<any>) =>
  asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const sort = (req.query.sort as string) || '-createdAt';
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    let filter: any = {};

    if (search) {
      filter.$or = [
        { titleEn: { $regex: search, $options: 'i' } },
        { titleAr: { $regex: search, $options: 'i' } },
        { nameEn: { $regex: search, $options: 'i' } },
        { nameAr: { $regex: search, $options: 'i' } },
      ];
    }

    if (req.query.isVisible !== undefined) {
      filter.isVisible = req.query.isVisible === 'true';
    }
    if (req.query.isPublished !== undefined) {
      filter.isPublished = req.query.isPublished === 'true';
    }
    if (req.query.isOpen !== undefined) {
      filter.isOpen = req.query.isOpen === 'true';
    }
    if (req.query.page_filter) {
      filter.page = req.query.page_filter;
    }

    const [data, total] = await Promise.all([
      Model.find(filter).sort(sort).skip(skip).limit(limit),
      Model.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  });

export const getOne = (Model: Model<any>) =>
  asyncHandler(async (req: Request, res: Response) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) throw new ApiError(404, 'Document not found');
    res.json({ success: true, data: doc });
  });

export const getBySlug = (Model: Model<any>) =>
  asyncHandler(async (req: Request, res: Response) => {
    const doc = await Model.findOne({ slug: req.params.slug });
    if (!doc) throw new ApiError(404, 'Document not found');
    res.json({ success: true, data: doc });
  });

export const createOne = (Model: Model<any>) =>
  asyncHandler(async (req: Request, res: Response) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ success: true, data: doc });
  });

export const updateOne = (Model: Model<any>) =>
  asyncHandler(async (req: Request, res: Response) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) throw new ApiError(404, 'Document not found');
    res.json({ success: true, data: doc });
  });

export const deleteOne = (Model: Model<any>) =>
  asyncHandler(async (req: Request, res: Response) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) throw new ApiError(404, 'Document not found');
    res.json({ success: true, message: 'Deleted successfully' });
  });

export const reorder = (Model: Model<any>) =>
  asyncHandler(async (req: Request, res: Response) => {
    const { items } = req.body;
    if (!Array.isArray(items)) throw new ApiError(400, 'Items array required');

    const operations = items.map((item: { id: string; order: number }) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order },
      },
    }));

    await Model.bulkWrite(operations);
    res.json({ success: true, message: 'Reordered successfully' });
  });
