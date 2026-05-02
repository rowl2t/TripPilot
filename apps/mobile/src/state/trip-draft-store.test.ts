import { describe, expect, it } from 'vitest';
import { useTripDraftStore } from './trip-draft-store';

describe('trip draft store', () => {
  it('moves steps and keeps bounds', () => {
    useTripDraftStore.getState().reset();
    useTripDraftStore.getState().next();
    expect(useTripDraftStore.getState().step).toBe(2);
    for (let i = 0; i < 10; i += 1) useTripDraftStore.getState().next();
    expect(useTripDraftStore.getState().step).toBe(7);
  });
});
