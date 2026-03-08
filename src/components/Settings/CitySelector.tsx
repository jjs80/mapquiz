import { useState, useMemo } from 'react';
import countriesData from '../../data/countries.json';
import citiesData from '../../data/cities.json';
import { getTranslation } from '../../i18n';
import { useSettingsStore } from '../../store/settingsStore';

interface Country {
  iso: string;
  nameEn: string;
  nameFi: string;
  region: string;
  subregion: string;
  difficulty: string;
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

interface CitySelectorProps {
  selectedCountries: string[];
  selectedCities: string[];
  onChange: (cityIds: string[]) => void;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  selectedCountries,
  selectedCities,
  onChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(
    new Set()
  );
  const { language } = useSettingsStore();
  const t = getTranslation(language);

  const cities = citiesData as City[];
  const countries = countriesData as Country[];
  const selectedSet = new Set(selectedCities);

  // Create country name lookup
  const countryNameMap = useMemo(() => {
    const map: { [key: string]: string } = {};
    countries.forEach((c) => {
      map[c.iso] = c.nameEn;
    });
    return map;
  }, []);

  // Group cities by country, filtered to selected countries
  const groupedCities = useMemo(() => {
    const groups: { [key: string]: City[] } = {};
    const selectedCountriesSet = new Set(selectedCountries);

    cities.forEach((city) => {
      if (selectedCountriesSet.has(city.countryIso)) {
        if (!groups[city.countryIso]) {
          groups[city.countryIso] = [];
        }
        groups[city.countryIso].push(city);
      }
    });

    // Sort cities within each country: capitals first, then majors, alphabetically
    Object.keys(groups).forEach((countryIso) => {
      groups[countryIso].sort((a, b) => {
        if (a.type === 'capital' && b.type !== 'capital') return -1;
        if (a.type !== 'capital' && b.type === 'capital') return 1;
        return a.nameEn.localeCompare(b.nameEn);
      });
    });

    return groups;
  }, [cities, selectedCountries]);

  // Filter cities by search query
  const filteredGroups = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const filtered: { [key: string]: City[] } = {};

    Object.entries(groupedCities).forEach(([countryIso, countryCities]) => {
      const matches = countryCities.filter((city) =>
        city.nameEn.toLowerCase().includes(query)
      );
      if (matches.length > 0) {
        filtered[countryIso] = matches;
      }
    });

    return filtered;
  }, [groupedCities, searchQuery]);

  const toggleCity = (cityId: string) => {
    const newSelected = new Set(selectedSet);
    if (newSelected.has(cityId)) {
      newSelected.delete(cityId);
    } else {
      newSelected.add(cityId);
    }
    onChange(Array.from(newSelected));
  };

  const toggleCountry = (countryIso: string) => {
    const newSelected = new Set(selectedSet);
    const visibleCities = filteredGroups[countryIso] || [];
    const allSelected = visibleCities.every((c) => newSelected.has(c.id));

    if (allSelected) {
      // Deselect all cities in this country (regardless of filter)
      groupedCities[countryIso].forEach((c) => newSelected.delete(c.id));
    } else {
      // Select all visible cities in this country
      visibleCities.forEach((c) => newSelected.add(c.id));
    }

    onChange(Array.from(newSelected));
  };

  const toggleCountryExpansion = (countryIso: string) => {
    const newExpanded = new Set(expandedCountries);
    if (newExpanded.has(countryIso)) {
      newExpanded.delete(countryIso);
    } else {
      newExpanded.add(countryIso);
    }
    setExpandedCountries(newExpanded);
  };

  const countryIsos = Object.keys(filteredGroups).sort((a, b) =>
    (countryNameMap[a] || '').localeCompare(countryNameMap[b] || '')
  );

  return (
    <div className="space-y-2">
      {/* Search input */}
      <input
        type="text"
        placeholder={t.settings.searchCities || 'Search cities…'}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded font-medium text-sm"
      />

      {/* City list */}
      <div className="border border-gray-300 rounded max-h-64 overflow-y-auto bg-white">
        {countryIsos.length === 0 ? (
          <div className="p-4 text-sm text-gray-500 text-center">
            {selectedCountries.length === 0
              ? 'Select countries first'
              : 'No cities found'}
          </div>
        ) : (
          countryIsos.map((countryIso) => (
            <div key={countryIso} className="border-b border-gray-200 last:border-b-0">
              {/* Country header */}
              <div className="flex items-center gap-2 p-2 bg-gray-50 hover:bg-gray-100">
                <button
                  onClick={() => toggleCountryExpansion(countryIso)}
                  className="text-gray-600 hover:text-gray-800 px-1"
                  aria-label={`Toggle ${countryNameMap[countryIso]}`}
                >
                  {expandedCountries.has(countryIso) ? '▼' : '▶'}
                </button>
                <input
                  type="checkbox"
                  onChange={() => toggleCountry(countryIso)}
                  checked={
                    (filteredGroups[countryIso] || []).length > 0 &&
                    (filteredGroups[countryIso] || []).every((c) =>
                      selectedSet.has(c.id)
                    )
                  }
                  className="accent-blue-500 cursor-pointer"
                />
                <label className="flex-1 font-medium text-sm cursor-pointer">
                  {countryNameMap[countryIso]}
                </label>
              </div>

              {/* Country cities */}
              {expandedCountries.has(countryIso) && (
                <div className="pl-8 pr-2 py-2 space-y-1 bg-white">
                  {(filteredGroups[countryIso] || []).map((city) => (
                    <label
                      key={city.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSet.has(city.id)}
                        onChange={() => toggleCity(city.id)}
                        className="accent-blue-500"
                      />
                      <span className="text-sm text-gray-800">
                        {city.nameEn}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          city.type === 'capital'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {city.type === 'capital' ? 'Capital' : 'Major'}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="text-sm text-gray-600">
        {selectedCities.length === 0
          ? t.settings.noCitiesWarning || 'Select at least one city'
          : `${selectedCities.length} ${t.settings.citiesSelected || 'cities selected'}`}
      </div>
    </div>
  );
};
