import { create } from 'zustand';

interface TripDraftState {
  draft: Record<string, unknown>;
  step: number;
  setField: (key: string, value: unknown) => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
}

export const useTripDraftStore = create<TripDraftState>((set) => ({
  draft: {},
  step: 1,
  setField: (key, value) => set((state) => ({ draft: { ...state.draft, [key]: value } })),
  next: () => set((state) => ({ step: Math.min(state.step + 1, 7) })),
  prev: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  reset: () => set({ draft: {}, step: 1 })
}));
