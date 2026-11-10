import type { Request, Response, NextFunction } from 'express';
import { getPuzzleTranslationModel } from '../models/puzzle-translation.model';

/** Public read-only locale dictionary. Translation editing is handled offline by reviewed imports. */
export async function getPuzzleTranslations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const locale = req.query.lang === 'en' ? 'en' : 'ko';
    const Translation = getPuzzleTranslationModel();
    const rows = await Translation.find({}, { key: 1, [locale]: 1, _id: 0 }).lean();
    const messages: Record<string, string> = {};
    for (const row of rows) {
      const value = row[locale];
      if (typeof value === 'string' && value.trim()) messages[row.key] = value;
    }
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json({ success: true, data: messages, locale });
  } catch (error) { next(error); }
}
