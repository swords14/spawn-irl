import { create } from 'zustand';

type AppState = 'start' | 'quests' | 'result';

interface GameState {
  userName: string;
  userTags: string[];
  currentStep: AppState;
  setUserName: (name: string) => void;
  addTags: (tags: string[]) => void;
  setStep: (step: AppState) => void;
  reset: () => void;
}

export const useStore = create<GameState>((set) => ({
  userName: '',
  userTags: [],
  currentStep: 'start',
  setUserName: (name) => set({ userName: name }),
  addTags: (tags) => set((state) => ({ userTags: [...state.userTags, ...tags] })),
  setStep: (step) => set({ currentStep: step }),
  reset: () => set({ userName: '', userTags: [], currentStep: 'start' }),
}));