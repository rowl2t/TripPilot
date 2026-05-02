import { describe, expect, it } from 'vitest';
import { isLongRouteLeg } from './provider';

describe('route warning logic', () => {
  it('flags long legs', () => {
    expect(isLongRouteLeg({ fromId: 'a', toId: 'b', mode: 'drive', durationMinutes: 120 })).toBe(true);
    expect(isLongRouteLeg({ fromId: 'a', toId: 'b', mode: 'walk', durationMinutes: 20 })).toBe(false);
  });
});
