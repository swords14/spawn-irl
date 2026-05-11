import { create } from 'zustand';

interface GameState {
  userName: string;
  currentStep: 'start' | 'quests' | 'result';
  userTags: string[];
  dynamicQuests: any[];
  setUserName: (name: string) => void;
  setStep: (step: 'start' | 'quests' | 'result') => void;
  addTags: (tags: string[]) => void;
  setDynamicQuests: (quests: any[]) => void;
  reset: () => void;
}

export const useStore = create<GameState>((set) => ({
  userName: '',
  currentStep: 'start',
  userTags: [],
  dynamicQuests: [],
  setUserName: (name) => set({ userName: name }),
  setStep: (step) => set({ currentStep: step }),
  addTags: (tags) => set((state) => ({ userTags: [...state.userTags, ...tags] })),
  setDynamicQuests: (quests) => set({ dynamicQuests: quests }),
  reset: () => set({ userName: '', currentStep: 'start', userTags: [], dynamicQuests: [] }),
}));