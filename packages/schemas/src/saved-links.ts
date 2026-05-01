import { z } from 'zod';

export const linkPlatformSchema = z.enum(['instagram', 'tiktok', 'youtube_shorts', 'blog', 'web', 'unknown']);
export const linkAnalysisStatusSchema = z.enum(['pending', 'processing', 'completed', 'failed']);

export const savedLinkCreateSchema = z.object({ url: z.string().url(), user_note: z.string().optional() });

export const savedLinkPlaceDecisionSchema = z.object({
  saved_link_place_id: z.string().uuid(),
  decision: z.enum(['confirm', 'reject'])
});
