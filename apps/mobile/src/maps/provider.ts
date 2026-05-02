export type PlaceType = 'hotel' | 'airport' | 'restaurant' | 'attraction';

export interface MapPin {
  id: string;
  day: number;
  order: number;
  name: string;
  address: string;
  category: string;
  rating: number;
  stayMinutes: number;
  reason: string;
  alternatives: string[];
  type: PlaceType;
}

export interface RouteLeg {
  fromId: string;
  toId: string;
  mode: 'walk' | 'transit' | 'drive';
  durationMinutes: number;
}

export const hasMapProvider = (): boolean => Boolean(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_PLACES_API_KEY);

export const getMockMapData = (): { pins: MapPin[]; legs: RouteLeg[] } => ({
  pins: [
    { id: '1', day: 1, order: 1, name: '호텔 체크인', address: '도쿄역 인근', category: 'hotel', rating: 4.4, stayMinutes: 60, reason: '동선 중심', alternatives: ['긴자 호텔'], type: 'hotel' },
    { id: '2', day: 1, order: 2, name: '아사쿠사', address: 'Taito City', category: 'attraction', rating: 4.5, stayMinutes: 120, reason: '초보자 대표 코스', alternatives: ['우에노 공원'], type: 'attraction' },
    { id: '3', day: 1, order: 3, name: '스시 런치', address: 'Asakusa', category: 'restaurant', rating: 4.3, stayMinutes: 90, reason: '근거리 식사', alternatives: ['라멘집'], type: 'restaurant' }
  ],
  legs: [
    { fromId: '1', toId: '2', mode: 'transit', durationMinutes: 35 },
    { fromId: '2', toId: '3', mode: 'walk', durationMinutes: 12 }
  ]
});

export const isLongRouteLeg = (leg: RouteLeg): boolean => leg.durationMinutes >= 90;
