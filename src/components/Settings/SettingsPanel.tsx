import { useSettingsStore, type Difficulty } from '../../store/settingsStore';
import { getTranslation } from '../../i18n';
import { Button } from '../UI/Button';
import regionsData from '../../data/regions.json';

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
    setMode,
    setSelectedRegions,
    setDifficulty,
    setQuestionCount,
  } = useSettingsStore();

  const t = getTranslation(language);
  const regions = regionsData as Region[];

  const toggleRegion = (regionId: string) => {
    if (selectedRegions.includes(regionId)) {
      setSelectedRegions(selectedRegions.filter((r: string) => r !== regionId));
    } else {
      setSelectedRegions([...selectedRegions, regionId]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
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

      {/* Buttons */}
      <div className="flex gap-2">
        <Button onClick={onClose} variant="secondary" size="md" fullWidth>
          {t.settings.back}
        </Button>
        <Button onClick={onStart} variant="primary" size="md" fullWidth>
          {t.settings.start}
        </Button>
      </div>
    </div>
  );
};
