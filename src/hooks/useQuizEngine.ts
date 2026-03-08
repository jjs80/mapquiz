import { useMemo } from 'react';
import { useQuizStore } from '../store/quizStore';
import { useSettingsStore } from '../store/settingsStore';
import {
  filterCountriesByRegionAndDifficulty,
  filterCitiesByRegionAndDifficulty,
  filterCountriesByCustomSelection,
  filterCitiesByCustomSelection,
} from '../utils/filterByRegion';
import { shuffle } from '../utils/shuffle';

export const useQuizEngine = () => {
  const {
    mode,
    selectedRegions,
    difficulty,
    questionCount,
    useCustomSelection,
    selectedCountries,
    selectedCities,
  } = useSettingsStore();

  const { startQuiz } = useQuizStore();

  // Generate quiz questions based on settings
  const quizQuestions = useMemo(() => {
    let items: any[] = [];

    if (useCustomSelection) {
      // Custom selection mode
      if (mode === 'countries') {
        const countries = filterCountriesByCustomSelection(selectedCountries);
        items = countries.map((country) => ({
          id: country.iso,
          nameEn: country.nameEn,
          nameFi: country.nameFi,
        }));
      } else {
        // cities mode
        const cities = filterCitiesByCustomSelection(selectedCountries, selectedCities);
        items = cities.map((city) => ({
          id: city.id,
          nameEn: city.nameEn,
          nameFi: city.nameFi,
        }));
      }
    } else {
      // Region-based selection mode
      if (mode === 'countries') {
        const countries = filterCountriesByRegionAndDifficulty(
          selectedRegions,
          difficulty
        );
        items = countries.map((country) => ({
          id: country.iso,
          nameEn: country.nameEn,
          nameFi: country.nameFi,
        }));
      } else {
        // cities mode
        const cities = filterCitiesByRegionAndDifficulty(
          selectedRegions,
          difficulty
        );
        items = cities.map((city) => ({
          id: city.id,
          nameEn: city.nameEn,
          nameFi: city.nameFi,
        }));
      }
    }

    const shuffled = shuffle(items);
    return shuffled.slice(0, questionCount);
  }, [mode, selectedRegions, difficulty, questionCount, useCustomSelection, selectedCountries, selectedCities]);

  const initializeQuiz = () => {
    startQuiz(quizQuestions);
  };

  return {
    quizQuestions,
    initializeQuiz,
  };
};
