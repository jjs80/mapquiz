import type { GeoPath } from 'd3-geo';
import type { FeatureCollection, Feature } from 'geojson';

interface CountryLayerProps {
  topoData: FeatureCollection;
  pathGenerator: GeoPath<any, any>;
  highlightedCountryId?: string;
  hoveredCountryId?: string | null;
  onCountryClick?: (iso: string) => void;
  onMouseEnter?: (countryId: string) => void;
  onMouseLeave?: () => void;
}

export const CountryLayer: React.FC<CountryLayerProps> = ({
  topoData,
  pathGenerator,
  highlightedCountryId,
  hoveredCountryId,
  onCountryClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <g className="country-layer">
      {topoData.features.map((feature: Feature, index: number) => {
        const iso = (feature.properties?.iso_a2 || '') as string;
        const pathData = pathGenerator(feature);
        
        if (!pathData) return null;

        const isHighlighted = iso === highlightedCountryId;
        const isHovered = iso === hoveredCountryId;

        return (
          <path
            key={index}
            d={pathData}
            className={`country-path ${isHighlighted ? 'highlighted' : ''}`}
            data-iso={iso}
            onClick={() => onCountryClick && iso && onCountryClick(iso)}
            onMouseEnter={() => onMouseEnter && onMouseEnter(iso)}
            onMouseLeave={() => onMouseLeave && onMouseLeave()}
            style={{
              fillOpacity: isHovered ? 0.8 : 1,
            }}
          />
        );
      })}
    </g>
  );
};
