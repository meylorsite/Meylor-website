import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

interface GetAllOptions {
  populate?: string;
}

// Skip these fields when building a dynamic text search to avoid leaking
// sensitive data or matching irrelevant meta fields.
const SEARCH_EXCLUDED_PATHS = new Set([
  'password',
  'refreshTokens',
  'slug',
  '_id',
  '__v',
  'createdAt',
  'updatedAt',
]);



export const getAll = (Model: Model<any>, options: GetAllOptions = {}) =>
  asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const sort = (req.query.sort as string) || '-createdAt';
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (search) {
      const searchFilter = buildSearchFilter(Model, search);
      if (searchFilter) Object.assign(filter, searchFilter);
    }


    }

    let query = Model.find(filter).sort(sort).skip(skip).limit(limit);
    if (options.populate) {
      query = query.populate(options.populate);
    }

    const [data, total] = await Promise.all([
      query.exec(),
      Model.countDocuments(filter),
    ]);


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
