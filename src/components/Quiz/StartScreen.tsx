import { useSettingsStore } from '../../store/settingsStore';
import { getTranslation } from '../../i18n';
import { Button } from '../UI/Button';
import countriesData from '../../data/countries.json';
import citiesData from '../../data/cities.json';

interface StartScreenProps {
  onSettingsClick: () => void;
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onSettingsClick,
  onStart,
}) => {
  const { language } = useSettingsStore();
  const t = getTranslation(language);

  const countries = countriesData as any[];
  const cities = citiesData as any[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        {/* Title and subtitle */}
        <h1 className="text-5xl font-bold text-blue-600 mb-2">
          {t.app.title}
        </h1>
        <p className="text-xl text-gray-600 mb-8">{t.app.subtitle}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded-lg">
          <div>
            <p className="text-gray-600 text-sm">Countries</p>
            <p className="text-3xl font-bold text-blue-600">{countries.length}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Cities</p>
            <p className="text-3xl font-bold text-blue-600">{cities.length}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          Test your geography knowledge by identifying countries and cities on
          an interactive world map. Available in English and Finnish.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={onStart}
            variant="primary"
            size="lg"
            fullWidth
          >
            Quick Start
          </Button>
          <Button
            onClick={onSettingsClick}
            variant="secondary"
            size="lg"
            fullWidth
          >
            {t.settings.settings}
          </Button>
        </div>
      </div>
    </div>
  );
};
