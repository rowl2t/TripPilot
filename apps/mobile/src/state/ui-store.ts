import { create } from 'zustand';

interface UiState { selectedTripId?: string; setSelectedTripId: (id: string) => void }

export const useUiStore = create<UiState>((set) => ({ setSelectedTripId: (id) => set({ selectedTripId: id }) }));
