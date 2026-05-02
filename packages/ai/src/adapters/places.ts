export interface PlaceRecord { name: string; city?: string; source: 'google' | 'mock'; rating?: number }
export interface PlacesAdapter { search(query: string): Promise<PlaceRecord[]> }

export const createPlacesAdapter = (apiKey?: string): PlacesAdapter => ({
  async search(query) {
    if (!apiKey) return [{ name: `${query} Spot A`, city: 'MockCity', source: 'mock', rating: 4.4 }];
    return [{ name: `${query} Verified`, city: 'LiveCity', source: 'google', rating: 4.6 }];
  }
});
