import { describe, expect, it } from 'vitest';
import { canRunAiPlan, monthlyUsageCostEstimate, remainingUsage } from './usage-limit';

describe('usage-limit service', () => {
  it('blocks when over monthly limit', () => {
    expect(canRunAiPlan({ monthlyLimit: 10, currentUsage: 10 })).toBe(false);
    expect(remainingUsage({ monthlyLimit: 10, currentUsage: 12 })).toBe(0);
  });

  it('blocks abnormally long inputs and excessive regeneration', () => {
    expect(canRunAiPlan({ monthlyLimit: 10, currentUsage: 1, inputLength: 6000 })).toBe(false);
    expect(canRunAiPlan({ monthlyLimit: 10, currentUsage: 1, regenerateRequests: 10 })).toBe(false);
  });

  it('estimates monthly usage cost from token usage', () => {
    expect(monthlyUsageCostEstimate(100000)).toBe(0.25);
  });
});
