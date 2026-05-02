export interface UsageLimitConfig {
  monthlyLimit: number;
  currentUsage: number;
  inputLength?: number;
  maxInputLength?: number;
  regenerateRequests?: number;
  regenerateLimit?: number;
}

export const canRunAiPlan = ({ monthlyLimit, currentUsage, inputLength = 0, maxInputLength = 5000, regenerateRequests = 0, regenerateLimit = 5 }: UsageLimitConfig): boolean =>
  currentUsage < monthlyLimit && inputLength <= maxInputLength && regenerateRequests <= regenerateLimit;

export const remainingUsage = ({ monthlyLimit, currentUsage }: UsageLimitConfig): number => Math.max(0, monthlyLimit - currentUsage);

export const monthlyUsageCostEstimate = (tokenUsage: number): number => tokenUsage * 0.0000025;
