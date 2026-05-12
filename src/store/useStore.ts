// src/store/useStore.ts
import { create } from 'zustand';

type AppState = 'start' | 'quests' | 'result';

interface GameState {
  userName: string;
  userAge: string;
  userGender: string;
  userJob: string;
  userCity: string;         // NOVO
  userMarital: string;      // NOVO
  userSalary: string;       // NOVO
  userTags: string[];
  dynamicQuests: any[];
  currentStep: AppState;
  
  // Atualizamos a assinatura para receber tudo
  setProfile: (name: string, age: string, gender: string, job: string, city: string, marital: string, salary: string) => void;
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
  userCity: '',             // NOVO
  userMarital: '',          // NOVO
  userSalary: '',           // NOVO
  userTags: [],
  dynamicQuests: [],
  currentStep: 'start',

  // Atualizando a função que guarda os dados
  setProfile: (name, age, gender, job, city, marital, salary) => set({ 
    userName: name, userAge: age, userGender: gender, userJob: job,
    userCity: city, userMarital: marital, userSalary: salary
  }),
  addTags: (tags) => set((state) => ({ 
    userTags: [...state.userTags, ...tags] 
  })),
  setDynamicQuests: (quests) => set({ dynamicQuests: quests }),
  setStep: (step) => set({ currentStep: step }),
  reset: () => set({ 
    userName: '', userAge: '', userGender: '', userJob: '', 
    userCity: '', userMarital: '', userSalary: '',
    userTags: [], dynamicQuests: [], currentStep: 'start' 
  }),
}));