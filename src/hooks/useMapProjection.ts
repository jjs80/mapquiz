import { useMemo } from 'react';
import { geoNaturalEarth1, geoPath } from 'd3';
import type { GeoProjection, GeoPath } from 'd3';

interface UseMapProjectionResult {
  projection: GeoProjection;
  pathGenerator: GeoPath<any, any>;
}

export const useMapProjection = (
  width: number,
  height: number
): UseMapProjectionResult => {
  return useMemo(() => {
    const projection = geoNaturalEarth1()
      .fitSize([width, height], {
        type: 'Sphere',
        features: [],
      } as any);

    const pathGenerator = geoPath(projection);

    return {
      projection,
      pathGenerator,
    };
  }, [width, height]);
};
