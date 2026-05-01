export interface RouteEstimationAdapter { travelMinutes(from: string, to: string): Promise<number> }
export const createRouteAdapter = (apiKey?: string): RouteEstimationAdapter => ({
  async travelMinutes(from, to) {
    if (!apiKey) return (from.length + to.length) % 40 + 20;
    return 35;
  }
});
