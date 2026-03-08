import { useState, useMemo } from 'react';
import countriesData from '../../data/countries.json';
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

interface CountrySelectorProps {
  selectedCountries: string[];
  onChange: (isos: string[]) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountries,
  onChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(
    new Set()
  );
  const { language } = useSettingsStore();
  const t = getTranslation(language);

  const countries = countriesData as Country[];
  const selectedSet = new Set(selectedCountries);

  // Group countries by region
  const groupedCountries = useMemo(() => {
    const groups: { [key: string]: Country[] } = {};

    countries.forEach((country) => {
      if (!groups[country.region]) {
        groups[country.region] = [];
      }
      groups[country.region].push(country);
    });

    // Sort countries within each region
    Object.keys(groups).forEach((region) => {
      groups[region].sort((a, b) => a.nameEn.localeCompare(b.nameEn));
    });

    return groups;
  }, []);

  // Filter countries by search query
  const filteredGroups = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const filtered: { [key: string]: Country[] } = {};

    Object.entries(groupedCountries).forEach(([region, regionCountries]) => {
      const matches = regionCountries.filter((country) =>
        country.nameEn.toLowerCase().includes(query)
      );
      if (matches.length > 0) {
        filtered[region] = matches;
      }
    });

    return filtered;
  }, [groupedCountries, searchQuery]);

  const toggleCountry = (iso: string) => {
    const newSelected = new Set(selectedSet);
    if (newSelected.has(iso)) {
      newSelected.delete(iso);
    } else {
      newSelected.add(iso);
    }
    onChange(Array.from(newSelected));
  };

  const toggleRegion = (region: string) => {
    const newSelected = new Set(selectedSet);
    const visibleCountries = filteredGroups[region] || [];
    const allSelected = visibleCountries.every((c) => newSelected.has(c.iso));

    if (allSelected) {
      // Deselect all countries in this region (regardless of filter)
      groupedCountries[region].forEach((c) => newSelected.delete(c.iso));
    } else {
      // Select all visible countries in this region
      visibleCountries.forEach((c) => newSelected.add(c.iso));
    }

    onChange(Array.from(newSelected));
  };

  const toggleRegionExpansion = (region: string) => {
    const newExpanded = new Set(expandedRegions);
    if (newExpanded.has(region)) {
      newExpanded.delete(region);
    } else {
      newExpanded.add(region);
    }
    setExpandedRegions(newExpanded);
  };

  const regions = Object.keys(filteredGroups).sort();

  return (
    <div className="space-y-2">
      {/* Search input */}
      <input
        type="text"
        placeholder={t.settings.searchCountries || 'Search countries…'}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded font-medium text-sm"
      />

      {/* Country list */}
      <div className="border border-gray-300 rounded max-h-64 overflow-y-auto bg-white">
        {regions.length === 0 ? (
          <div className="p-4 text-sm text-gray-500 text-center">
            No countries found
          </div>
        ) : (
          regions.map((region) => (
            <div key={region} className="border-b border-gray-200 last:border-b-0">
              {/* Region header */}
              <div className="flex items-center gap-2 p-2 bg-gray-50 hover:bg-gray-100">
                <button
                  onClick={() => toggleRegionExpansion(region)}
                  className="text-gray-600 hover:text-gray-800 px-1"
                  aria-label={`Toggle ${region}`}
                >
                  {expandedRegions.has(region) ? '▼' : '▶'}
                </button>
                <input
                  type="checkbox"
                  onChange={() => toggleRegion(region)}
                  checked={
                    (filteredGroups[region] || []).length > 0 &&
                    (filteredGroups[region] || []).every((c) =>
                      selectedSet.has(c.iso)
                    )
                  }
                  className="accent-blue-500 cursor-pointer"
                />
                <label className="flex-1 font-medium text-sm capitalize cursor-pointer">
                  {region}
                </label>
              </div>

              {/* Region countries */}
              {expandedRegions.has(region) && (
                <div className="pl-8 pr-2 py-2 space-y-1 bg-white">
                  {(filteredGroups[region] || []).map((country) => (
                    <label
                      key={country.iso}
                      className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSet.has(country.iso)}
                        onChange={() => toggleCountry(country.iso)}
                        className="accent-blue-500"
                      />
                      <span className="text-sm text-gray-800">
                        {country.nameEn}
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
        {selectedCountries.length === 0
          ? t.settings.noCountriesWarning || 'Select at least one country'
          : `${selectedCountries.length} ${t.settings.countriesSelected || 'countries selected'}`}
      </div>
    </div>
  );
};
