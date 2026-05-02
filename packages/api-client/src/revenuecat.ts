export interface RevenueCatAdapter {
  getOfferings(): Promise<{ packages: string[] }>;
  purchase(pkg: string): Promise<{ entitlement: 'free' | 'pro_monthly' }>;
  restore(): Promise<{ restored: boolean }>;
}

export const createRevenueCatAdapter = (apiKey?: string): RevenueCatAdapter => ({
  async getOfferings() {
    if (!apiKey) return { packages: ['pro_monthly_mock'] };
    return { packages: ['pro_monthly_live'] };
  },
  async purchase(_pkg) {
    return { entitlement: 'pro_monthly' };
  },
  async restore() {
    return { restored: true };
  }
});
