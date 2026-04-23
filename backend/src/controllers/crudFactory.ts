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

    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (search) {
      const searchFilter = buildSearchFilter(Model, search);
      if (searchFilter) Object.assign(filter, searchFilter);
    }


    
    ]);


export const getBySlug = (Model: Model<any>) =>
  asyncHandler(async (req: Request, res: Response) => {
    const doc = await Model.findOne({ slug: req.params.slug });
    if (!doc) throw new ApiError(404, 'Document not found');
    res.json({ success: true, data: doc });
  });

 new ApiError(400, 'Items array required');

    const operations = items.map((item: { id: string; order: number }) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order },
      },
    }));

    await Model.bulkWrite(operations);
    res.json({ success: true, message: 'Reordered successfully' });
  });
