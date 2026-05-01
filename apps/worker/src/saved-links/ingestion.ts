import { createSupabaseServerClient } from '@trippilot/api-client';

const detectPlatform = (url: string): string => {
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('youtube.com/shorts') || url.includes('youtu.be')) return 'youtube_shorts';
  if (url.includes('blog')) return 'blog';
  return 'web';
};

const extractCandidates = (text: string): Array<{ candidate_name: string; confidence: number }> => {
  const words = text.split(/\s+/).filter((w) => /^[A-Z][a-zA-Z]{2,}$/.test(w));
  return words.slice(0, 3).map((w, i) => ({ candidate_name: w, confidence: Math.max(0.5, 0.9 - i * 0.15) }));
};

export const processSavedLink = async (savedLinkId: string): Promise<void> => {
  const client = createSupabaseServerClient({ url: process.env.SUPABASE_URL ?? '', serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '' });

  await client.from('saved_links').update({ analysis_status: 'processing' }).eq('id', savedLinkId);

  const row = await client.from('saved_links').select('id,url,title,description').eq('id', savedLinkId).single();
  if (row.error || !row.data) {
    await client.from('saved_links').update({ analysis_status: 'failed' }).eq('id', savedLinkId);
    return;
  }

  const platform = detectPlatform(row.data.url);
  const title = row.data.title ?? row.data.url;
  const description = row.data.description ?? 'metadata unavailable';
  const candidates = extractCandidates(`${title} ${description}`);

  for (const c of candidates) {
    await client.from('saved_link_places').insert({ saved_link_id: savedLinkId, candidate_name: c.candidate_name, confidence: c.confidence, evidence: { platform, source: 'text-only' } });
  }

  await client.from('saved_links').update({ source_platform: platform, analysis_status: 'completed', raw_metadata: { title, description } }).eq('id', savedLinkId);
};
