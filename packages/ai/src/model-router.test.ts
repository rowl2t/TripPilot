import { describe, expect, it } from 'vitest';
import { createModelRoutingPolicy } from './model-router';

describe('model router', () => {
  it('routes preprocessing tasks to fast model', () => {
    const router = createModelRoutingPolicy({ fastModel: 'gpt-fast', qualityModel: 'gpt-quality' });
    expect(router.route('normalize_input')).toBe('gpt-fast');
    expect(router.route('link_metadata_summary')).toBe('gpt-fast');
    expect(router.route('candidate_extraction')).toBe('gpt-fast');
  });

  it('routes final generation tasks to quality model', () => {
    const router = createModelRoutingPolicy({ fastModel: 'gpt-fast', qualityModel: 'gpt-5.5' });
    expect(router.route('final_itinerary')).toBe('gpt-5.5');
    expect(router.route('critique_repair')).toBe('gpt-5.5');
  });
});
