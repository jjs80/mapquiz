import { useMemo } from 'react';
import { useSettingsStore, type Difficulty } from '../../store/settingsStore';
import { getTranslation } from '../../i18n';
import { Button } from '../UI/Button';
import { CountrySelector } from './CountrySelector';
import { CitySelector } from './CitySelector';
import regionsData from '../../data/regions.json';
import citiesData from '../../data/cities.json';

interface SettingsPanelProps {
  onClose: () => void;
  onStart: () => void;
}

interface Region {
  id: string;
  labelEn: string;
  labelFi: string;
  subregions: string[];
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

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  onClose,
  onStart,
}) => {
  const {
    mode,
    selectedRegions,
    difficulty,
    questionCount,
    language,
    useCustomSelection,
    selectedCountries,
    selectedCities,
    setMode,
    setSelectedRegions,
    setDifficulty,
    setQuestionCount,
    setUseCustomSelection,
    setSelectedCountries,
    setSelectedCities,
  } = useSettingsStore();

  const t = getTranslation(language);
  const regions = regionsData as Region[];
  const cities = citiesData as City[];

  // Sync selectedCities when selectedCountries changes
  const handleCountriesChange = (newCountries: string[]) => {
    setSelectedCountries(newCountries);
    // Remove cities that belong to deselected countries
    const selectedCountriesSet = new Set(newCountries);
    const validCities = selectedCities.filter((cityId) => {
      const city = cities.find((c) => c.id === cityId);
      return city && selectedCountriesSet.has(city.countryIso);
    });
    setSelectedCities(validCities);
  };

  const toggleRegion = (regionId: string) => {
    if (selectedRegions.includes(regionId)) {
      setSelectedRegions(selectedRegions.filter((r: string) => r !== regionId));
    } else {
      setSelectedRegions([...selectedRegions, regionId]);
    }
  };

  // Determine if Start button should be disabled
  const isStartDisabled = useMemo(() => {
    if (!useCustomSelection) {
      return false;
    }
    if (selectedCountries.length === 0) {
      return true;
    }
    if (mode === 'cities' && selectedCities.length === 0) {
      return true;
    }
    return false;
  }, [useCustomSelection, selectedCountries, selectedCities, mode]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {t.settings.settings}
      </h2>

      {/* Mode selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t.settings.mode}
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('countries')}
            className={`flex-1 py-2 px-4 rounded font-medium transition-colors ${
              mode === 'countries'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {t.settings.countries}
          </button>
          <button
            onClick={() => setMode('cities')}
            className={`flex-1 py-2 px-4 rounded font-medium transition-colors ${
              mode === 'cities'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {t.settings.cities}
          </button>
        </div>
      </div>

      {/* Selection method toggle */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t.settings.selectionMethod || 'Selection method'}
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setUseCustomSelection(false)}
            className={`flex-1 py-2 px-4 rounded font-medium transition-colors ${
              !useCustomSelection
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {t.settings.byRegion || 'By region'}
          </button>
          <button
            onClick={() => setUseCustomSelection(true)}
            className={`flex-1 py-2 px-4 rounded font-medium transition-colors ${
              useCustomSelection
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {t.settings.customSelection || 'Custom'}
          </button>
        </div>
      </div>

      {/* Region-based or custom selection */}
      {!useCustomSelection ? (
        <>
          {/* Difficulty selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t.settings.difficulty}
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full p-2 border border-gray-300 rounded font-medium"
            >
              <option value="easy">{t.settings.easy}</option>
              <option value="normal">{t.settings.normal}</option>
              <option value="hard">{t.settings.hard}</option>
            </select>
          </div>

          {/* Question count */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t.settings.questionCount}
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded font-medium"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Regions */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t.settings.regions}
            </label>
            <div className="space-y-2">
              {regions.map((region) => (
                <label key={region.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedRegions.includes(region.id)}
                    onChange={() => toggleRegion(region.id)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-700">
                    {language === 'en' ? region.labelEn : region.labelFi}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Custom selection: countries */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t.settings.countries}
            </label>
            <CountrySelector
              selectedCountries={selectedCountries}
              onChange={handleCountriesChange}
            />
          </div>

          {/* Custom selection: cities (only in cities mode) */}
          {mode === 'cities' && selectedCountries.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.settings.cities}
              </label>
              <CitySelector
                selectedCountries={selectedCountries}
                selectedCities={selectedCities}
                onChange={setSelectedCities}
              />
            </div>
          )}
        </>
      )}

      {/* Question count (always shown) */}
      {useCustomSelection && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t.settings.questionCount}
          </label>
          <select
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded font-medium"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      )}

      {/* Error message for custom selection */}
      {useCustomSelection && isStartDisabled && (
        <div className="mb-6 p-3 bg-red-100 border border-red-400 rounded">
          <p className="text-sm text-red-800">
            {selectedCountries.length === 0
              ? t.settings.noCountriesWarning || 'Please select at least one country'
              : t.settings.noCitiesWarning || 'Please select at least one city'}
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2">
        <Button onClick={onClose} variant="secondary" size="md" fullWidth>
          {t.settings.back}
        </Button>
        <Button
          onClick={onStart}
          variant="primary"
          size="md"
          fullWidth
          disabled={isStartDisabled}
          title={
            isStartDisabled
              ? selectedCountries.length === 0
                ? 'Please select at least one country'
                : 'Please select at least one city'
              : ''
          }
        >
          {t.settings.start}
        </Button>
      </div>
    </div>
  );
};
