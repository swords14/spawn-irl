import { create } from 'zustand';

type AppState = 'start' | 'quests' | 'result';

interface GameState {
  userName: string;
  userTags: string[];
  dynamicQuests: any[];
  currentStep: AppState;
  
  setUserName: (name: string) => void;
  addTags: (tags: string[]) => void;
  setDynamicQuests: (quests: any[]) => void;
  setStep: (step: AppState) => void;
  reset: () => void;
}

export const useStore = create<GameState>((set) => ({
  userName: '',
  userTags: [],
  dynamicQuests: [],
  currentStep: 'start',

  setUserName: (name) => set({ userName: name }),
  addTags: (tags) => set((state) => ({ 
    userTags: [...state.userTags, ...tags] 
  })),
  setDynamicQuests: (quests) => set({ dynamicQuests: quests }),
  setStep: (step) => set({ currentStep: step }),
  reset: () => set({ 
    userName: '', 
    userTags: [], 
    dynamicQuests: [], 
    currentStep: 'start' 
  }),
}));