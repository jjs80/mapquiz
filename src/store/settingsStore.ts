import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '../i18n';

export type QuizMode = 'countries' | 'cities';
export type Difficulty = 'easy' | 'normal' | 'hard';

interface SettingsState {
  mode: QuizMode;
  selectedRegions: string[];
  difficulty: Difficulty;
  questionCount: number;
  language: Language;
  useCustomSelection: boolean;
  selectedCountries: string[];
  selectedCities: string[];
  setMode: (mode: QuizMode) => void;
  setSelectedRegions: (regions: string[]) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setQuestionCount: (count: number) => void;
  setLanguage: (language: Language) => void;
  setUseCustomSelection: (use: boolean) => void;
  setSelectedCountries: (countries: string[]) => void;
  setSelectedCities: (cities: string[]) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (set: any): SettingsState => ({
      mode: 'countries' as QuizMode,
      selectedRegions: ['europe', 'asia', 'africa', 'americas', 'oceania'],
      difficulty: 'normal' as Difficulty,
      questionCount: 20,
      language: 'en' as Language,
      useCustomSelection: false,
      selectedCountries: [],
      selectedCities: [],
      setMode: (mode: QuizMode) => set({ mode }),
      setSelectedRegions: (regions: string[]) => set({ selectedRegions: regions }),
      setDifficulty: (difficulty: Difficulty) => set({ difficulty }),
      setQuestionCount: (count: number) => set({ questionCount: count }),
      setLanguage: (language: Language) => set({ language }),
      setUseCustomSelection: (use: boolean) => set({ useCustomSelection: use }),
      setSelectedCountries: (countries: string[]) => set({ selectedCountries: countries }),
      setSelectedCities: (cities: string[]) => set({ selectedCities: cities }),
    }),
    {
      name: 'mapquiz-settings',
    }
  )
);
