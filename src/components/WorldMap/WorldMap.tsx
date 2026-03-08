import { useEffect, useState, useRef } from 'react';
import { zoom, zoomIdentity, select } from 'd3';
import type { FeatureCollection } from 'geojson';
import { useMapProjection } from '../../hooks/useMapProjection';
import { CountryLayer } from './CountryLayer';
import { CityLayer } from './CityLayer';

interface WorldMapProps {
  width: number;
  height: number;
  topoData: FeatureCollection | null;
  highlightedCountryId?: string;
  highlightedCityId?: string;
  showCities?: boolean;
  visibleCityIds?: string[];
  onCountryClick?: (iso: string) => void;
  onCityClick?: (cityId: string) => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  width,
  height,
  topoData,
  highlightedCountryId,
  highlightedCityId,
  showCities = false,
  visibleCityIds,
  onCountryClick,
  onCityClick,
}) => {
  const [hoveredCountryId, setHoveredCountryId] = useState<string | null>(null);
  const [hoveredCityId, setHoveredCityId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<SVGGElement>(null);

  const { projection, pathGenerator } = useMapProjection(width, height);

  // Setup D3 zoom behavior
  useEffect(() => {
    const svg = svgRef.current;
    const group = groupRef.current;
    
    if (!svg || !group) return;

    const zoomBehavior = zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event: any) => {
        group.setAttribute('transform', event.transform.toString());
        setZoomLevel(event.transform.k);
      });

    select(svg).call(zoomBehavior as any);
  }, []);

  // Zoom functions
  const handleZoomIn = () => {
    const svg = svgRef.current;
    const group = groupRef.current;
    if (!svg || !group) return;
    
    const newZoom = Math.min(zoomLevel * 1.5, 8);
    const zoomBehavior = zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event: any) => {
        group.setAttribute('transform', event.transform.toString());
        setZoomLevel(event.transform.k);
      });

    select(svg)
      .transition()
      .duration(300)
      .call(zoomBehavior.transform as any, zoomIdentity.scale(newZoom));
  };

  const handleZoomOut = () => {
    const svg = svgRef.current;
    const group = groupRef.current;
    if (!svg || !group) return;
    
    const newZoom = Math.max(zoomLevel / 1.5, 1);
    const zoomBehavior = zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event: any) => {
        group.setAttribute('transform', event.transform.toString());
        setZoomLevel(event.transform.k);
      });

    select(svg)
      .transition()
      .duration(300)
      .call(zoomBehavior.transform as any, zoomIdentity.scale(newZoom));
  };

  const handleResetZoom = () => {
    const svg = svgRef.current;
    const group = groupRef.current;
    if (!svg || !group) return;
    
    const zoomBehavior = zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event: any) => {
        group.setAttribute('transform', event.transform.toString());
        setZoomLevel(event.transform.k);
      });

    select(svg)
      .transition()
      .duration(300)
      .call(zoomBehavior.transform as any, zoomIdentity);
  };

  return (
    <div className="relative bg-blue-50 border border-gray-300" style={{ width, height }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      >
        <defs>
          <style>{`
            .country-path {
              fill: #e5e7eb;
              stroke: #9ca3af;
              stroke-width: 0.5;
              cursor: pointer;
              transition: fill 0.2s ease;
            }
            .country-path:hover {
              fill: #d1d5db;
              stroke: #6b7280;
            }
            .country-path.highlighted {
              fill: #10b981;
              stroke: #059669;
            }
            .country-path.highlighted-wrong {
              fill: #ef4444;
              stroke: #dc2626;
            }
            .city-circle {
              fill: #3b82f6;
              stroke: white;
              stroke-width: 1;
              cursor: pointer;
              transition: r 0.2s ease;
            }
            .city-circle:hover {
              filter: brightness(1.2);
            }
            .city-circle.highlighted {
              fill: #10b981;
            }
            .city-circle.highlighted-wrong {
              fill: #ef4444;
            }
          `}</style>
        </defs>

        {/* Zoomable group */}
        <g ref={groupRef}>
          {/* Render country layer */}
          {topoData && (
            <CountryLayer
              topoData={topoData}
              pathGenerator={pathGenerator}
              highlightedCountryId={highlightedCountryId}
              hoveredCountryId={hoveredCountryId}
              onCountryClick={onCountryClick}
              onMouseEnter={setHoveredCountryId}
              onMouseLeave={() => setHoveredCountryId(null)}
            />
          )}

          {/* Render city layer if enabled */}
          {showCities && (
            <CityLayer
              projection={projection}
              zoomLevel={zoomLevel}
              highlightedCityId={highlightedCityId}
              hoveredCityId={hoveredCityId}
              visibleCityIds={visibleCityIds}
              onCityClick={onCityClick}
              onMouseEnter={setHoveredCityId}
              onMouseLeave={() => setHoveredCityId(null)}
            />
          )}
        </g>
      </svg>

      {/* Zoom controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="bg-white hover:bg-gray-100 border border-gray-300 rounded p-2 shadow-md w-10 h-10 flex items-center justify-center font-bold text-lg text-gray-700"
          title="Zoom in (Ctrl+Plus)"
        >
          +
        </button>
        <button
          onClick={handleResetZoom}
          className="bg-white hover:bg-gray-100 border border-gray-300 rounded p-2 shadow-md w-10 h-10 flex items-center justify-center text-xs font-bold text-gray-700"
          title="Reset zoom"
        >
          Reset
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white hover:bg-gray-100 border border-gray-300 rounded p-2 shadow-md w-10 h-10 flex items-center justify-center font-bold text-lg text-gray-700"
          title="Zoom out (Ctrl+Minus)"
        >
          −
        </button>
      </div>

      {/* Zoom level indicator */}
      <div className="absolute bottom-4 left-4 bg-white border border-gray-300 rounded px-3 py-1 text-sm text-gray-700 shadow-md">
        {(zoomLevel * 100).toFixed(0)}%
      </div>
    </div>
  );
};
