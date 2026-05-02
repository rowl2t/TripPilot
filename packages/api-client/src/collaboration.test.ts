import { describe, expect, it } from 'vitest';

import { buildRegenerateConstraints, summarizeVotes } from './collaboration';

describe('vote summary', () => {
  it('marks avoid on high dislike', () => {
    const s = summarizeVotes([{ vote: 'dislike' }, { vote: 'dislike' }]);
    expect(s.shouldAvoid).toBe(true);
    expect(buildRegenerateConstraints(s, 'Place A').avoid_places).toContain('Place A');
  });
});
