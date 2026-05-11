import { create } from 'zustand';

type AppState = 'start' | 'quests' | 'result';

interface GameState {
  userName: string;
  userAge: string;
  userGender: string;
  userJob: string;
  userTags: string[];
  dynamicQuests: any[];
  currentStep: AppState;
  
  setProfile: (name: string, age: string, gender: string, job: string) => void;
  addTags: (tags: string[]) => void;
  setDynamicQuests: (quests: any[]) => void;
  setStep: (step: AppState) => void;
  reset: () => void;
}

export const useStore = create<GameState>((set) => ({
  userName: '',
  userAge: '',
  userGender: '',
  userJob: '',
  userTags: [],
  dynamicQuests: [],
  currentStep: 'start',

  setProfile: (name, age, gender, job) => set({ 
    userName: name, userAge: age, userGender: gender, userJob: job 
  }),
  addTags: (tags) => set((state) => ({ 
    userTags: [...state.userTags, ...tags] 
  })),
  setDynamicQuests: (quests) => set({ dynamicQuests: quests }),
  setStep: (step) => set({ currentStep: step }),
  reset: () => set({ 
    userName: '', userAge: '', userGender: '', userJob: '', 
    userTags: [], dynamicQuests: [], currentStep: 'start' 
  }),
}));