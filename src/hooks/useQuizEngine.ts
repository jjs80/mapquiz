import { useMemo } from 'react';
import { useQuizStore, type QuizQuestion } from '../store/quizStore';
import { useSettingsStore } from '../store/settingsStore';
import {
  filterCountriesByRegionAndDifficulty,
  filterCitiesByRegionAndDifficulty,
} from '../utils/filterByRegion';
import { shuffle } from '../utils/shuffle';

export const useQuizEngine = () => {
  const {
    mode,
    selectedRegions,
    difficulty,
    questionCount,
  } = useSettingsStore();

  const { startQuiz } = useQuizStore();

  // Generate quiz questions based on settings
  const quizQuestions = useMemo(() => {
    if (mode === 'countries') {
      const countries = filterCountriesByRegionAndDifficulty(
        selectedRegions,
        difficulty
      );

      const questions: QuizQuestion[] = countries.map((country) => ({
        id: country.iso,
        nameEn: country.nameEn,
        nameFi: country.nameFi,
      }));

      const shuffled = shuffle(questions);
      return shuffled.slice(0, questionCount);
    } else {
      // cities mode
      const cities = filterCitiesByRegionAndDifficulty(
        selectedRegions,
        difficulty
      );

      const questions: QuizQuestion[] = cities.map((city) => ({
        id: city.id,
        nameEn: city.nameEn,
        nameFi: city.nameFi,
      }));

      const shuffled = shuffle(questions);
      return shuffled.slice(0, questionCount);
    }
  }, [mode, selectedRegions, difficulty, questionCount]);

  const initializeQuiz = () => {
    startQuiz(quizQuestions);
  };

  return {
    quizQuestions,
    initializeQuiz,
  };
};
