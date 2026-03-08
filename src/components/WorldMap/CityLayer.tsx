import { useMemo } from 'react';
import type { GeoProjection } from 'd3-geo';
import citiesData from '../../data/cities.json';

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

interface CityLayerProps {
  projection: GeoProjection;
  zoomLevel?: number;
  highlightedCityId?: string;
  hoveredCityId?: string | null;
  visibleCityIds?: string[];
  onCityClick?: (cityId: string) => void;
  onMouseEnter?: (cityId: string) => void;
  onMouseLeave?: () => void;
}

export const CityLayer: React.FC<CityLayerProps> = ({
  projection,
  zoomLevel = 1,
  highlightedCityId,
  hoveredCityId,
  visibleCityIds,
  onCityClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const cities = useMemo(() => citiesData as City[], []);
  const visibleCitySet = useMemo(
    () => (visibleCityIds ? new Set(visibleCityIds) : null),
    [visibleCityIds]
  );

  return (
    <g className="city-layer">
      {cities.map((city) => {
        // Skip cities not in the visible set
        if (visibleCitySet && !visibleCitySet.has(city.id)) {
          return null;
        }
        const [x, y] = projection([city.lon, city.lat]) || [0, 0];
        
        if (x === null || y === null) return null;

        const isHighlighted = city.id === highlightedCityId;
        const isHovered = city.id === hoveredCityId;

        // Scale radius inversely with zoom to keep dots proportionally sized
        const baseRadius = city.type === 'capital' ? 3.5 : 2;
        const radius = Math.max(baseRadius / Math.sqrt(zoomLevel), 1);

        return (
          <circle
            key={city.id}
            cx={x}
            cy={y}
            className={`city-circle ${city.type} ${
              isHighlighted ? 'highlighted' : ''
            }`}
            data-city-id={city.id}
            onClick={() => onCityClick && onCityClick(city.id)}
            onMouseEnter={() => onMouseEnter && onMouseEnter(city.id)}
            onMouseLeave={() => onMouseLeave && onMouseLeave()}
            style={{
              r: radius,
              opacity: isHovered ? 0.8 : 1,
            }}
          />
        );
      })}
    </g>
  );
};
