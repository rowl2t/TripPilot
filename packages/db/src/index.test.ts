import { describe, expect, it } from 'vitest';

import { BOOKING_TASK_STATUS, SAVED_LINK_ANALYSIS_STATUS, TRIP_STATUS, TRIP_VISIBILITY } from './index';

describe('db domain constants', () => {
  it('keeps trip states aligned with migration intent', () => {
    expect(TRIP_STATUS).toEqual(['draft', 'planning', 'ready', 'archived']);
    expect(TRIP_VISIBILITY).toEqual(['private', 'shared']);
  });

  it('keeps operational statuses constrained', () => {
    expect(BOOKING_TASK_STATUS).toContain('scheduled');
    expect(SAVED_LINK_ANALYSIS_STATUS).toContain('processing');
  });
});
