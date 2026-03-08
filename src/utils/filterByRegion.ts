import countriesData from '../data/countries.json';
import citiesData from '../data/cities.json';
import type { Difficulty } from '../store/settingsStore';

interface Country {
  iso: string;
  nameEn: string;
  nameFi: string;
  region: string;
  subregion: string;
  difficulty: Difficulty;
}

interface City {
  id: string;
  nameEn: string;
  nameFi: string;
  countryIso: string;
  lat: number;
  lon: number;
  type: 'capital' | 'major';
  population: number;
}

/**
 * Filter countries by selected regions and difficulty
 */
export const filterCountriesByRegionAndDifficulty = (
  selectedRegions: string[],
  difficulty: Difficulty
): Country[] => {
  const countries = countriesData as Country[];

  return countries.filter((country) => {
    const regionMatch = selectedRegions.includes(country.region);
    const difficultyMatch =
      difficulty === 'hard' ||
      (difficulty === 'normal' && country.difficulty !== 'hard') ||
      (difficulty === 'easy' && country.difficulty === 'easy');

    return regionMatch && difficultyMatch;
  });
};

/**
 * Filter cities by selected regions and country difficulty
 */
export const filterCitiesByRegionAndDifficulty = (
  selectedRegions: string[],
  difficulty: Difficulty
): City[] => {
  const cities = citiesData as City[];

  const allowedCountries = filterCountriesByRegionAndDifficulty(
    selectedRegions,
    difficulty
  );
  const allowedCountryIsos = new Set(allowedCountries.map((c) => c.iso));

  return cities.filter((city) => {
    const countryAllowed = allowedCountryIsos.has(city.countryIso);
    // For easy mode, only show capitals
    const typeMatch =
      difficulty !== 'easy' || city.type === 'capital';

    return countryAllowed && typeMatch;
  });
};

/**
 * Get all unique regions from data
 */
export const getAllRegions = (): string[] => {
  const countries = countriesData as Country[];
  const regions = new Set(countries.map((c) => c.region));
  return Array.from(regions);
};
