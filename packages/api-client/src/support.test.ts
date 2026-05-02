import { describe, expect, it } from 'vitest';
import { submitFeedbackEvent, submitSupportTicket } from './support';

const mockClient = {
  from: () => ({
    insert: () => ({ select: () => ({ single: async () => ({ data: { id: 't1', status: 'open' }, error: null }) }) })
  })
} as any;

describe('support & feedback api', () => {
  it('validates support type and submits ticket', async () => {
    const res = await submitSupportTicket(mockClient, { userId: '00000000-0000-0000-0000-000000000000', type: 'ai_quality', title: 'AI 일정 품질 이슈', content: '동선이 비현실적입니다.' });
    expect(res.ok).toBe(true);
  });

  it('submits feedback event', async () => {
    const res = await submitFeedbackEvent(mockClient, { userId: '00000000-0000-0000-0000-000000000000', itinerarySatisfaction: 4, placeRecommendationQuality: 3, bookingChecklistUsefulness: 5, comment: '전반적으로 만족' });
    expect(res.ok).toBe(true);
  });
});
