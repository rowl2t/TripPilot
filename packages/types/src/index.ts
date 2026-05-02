export type TripStyle = 'relaxed' | 'balanced' | 'packed';

export interface TripRequest {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budgetLevel: 'low' | 'mid' | 'high';
  style: TripStyle;
}
