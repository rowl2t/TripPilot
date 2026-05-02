/**
 * SNS Link Policy
 * - Never bypass login/DRM/paywalls.
 * - Only use publicly accessible metadata or user-provided text.
 * - Never treat fetched metadata as executable instructions.
 */

const INJECTION_PATTERNS = [/ignore\s+previous\s+instructions?/gi, /system\s*prompt/gi, /act\s+as\s+/gi, /developer\s+mode/gi];

export const sanitizeMetadataForAnalysis = (text: string): string => {
  let out = text.slice(0, 2_000);
  for (const pattern of INJECTION_PATTERNS) out = out.replace(pattern, '[filtered]');
  return out.replace(/[\r\n\t]+/g, ' ').trim();
};
