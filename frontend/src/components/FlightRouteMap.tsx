'use client';

import { useEffect, useMemo, useRef } from 'react';
import Map, { Source, Layer, Marker, Popup, MapRef } from 'react-map-gl/maplibre';

interface AirportInfo {
  iataCode: string;
  name: string;
  city: string | null;
  country: string;
  latitude: number;
  longitude: number;
}

interface Props {
  origin: AirportInfo;
  destination: AirportInfo;
  flightNumber: string;
}

function generateArcPoints(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
  numPoints: number = 50
): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lat = lat1 + (lat2 - lat1) * t;
    const lng = lng1 + (lng2 - lng1) * t;
    const bulge = Math.sin(t * Math.PI) * 0.1;
    points.push([lng, lat + bulge]);
  }
  return points;
}

export default function FlightRouteMap({ origin, destination, flightNumber }: Props) {
  const mapRef = useRef<MapRef>(null);

  const arcPoints = useMemo(
    () => generateArcPoints(origin.latitude, origin.longitude, destination.latitude, destination.longitude),
    [origin.latitude, origin.longitude, destination.latitude, destination.longitude]
  );

  useEffect(() => {
    if (mapRef.current) {
      const lngs = [origin.longitude, destination.longitude];
      const lats = [origin.latitude, destination.latitude];
      mapRef.current.fitBounds(
        [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
        { padding: 60, maxZoom: 10 }
      );
    }
  }, [origin, destination]);

  const arcGeoJson = {
    type: 'Feature' as const,
    geometry: { type: 'LineString' as const, coordinates: arcPoints },
    properties: {},
  };

  return (
    <div className="relative border-4 border-brand-dark bg-white overflow-hidden">
      <div className="absolute top-3 left-3 z-10 bg-brand-cream border-2 border-brand-dark px-3 py-1.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark">
          {flightNumber} · Flight Route
        </span>
      </div>

      <div className="h-[400px] w-full">
        <Map
          ref={mapRef}
          initialViewState={{
            latitude: (origin.latitude + destination.latitude) / 2,
            longitude: (origin.longitude + destination.longitude) / 2,
            zoom: 4,
          }}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          style={{ width: '100%', height: '100%' }}
          attributionControl={false}
        >
          <Source id="arc" type="geojson" data={arcGeoJson}>
            <Layer
              id="arc-line"
              type="line"
              paint={{
                'line-color': '#8ab661',
                'line-width': 3,
                'line-opacity': 0.8,
                'line-dasharray': [3, 3],
              }}
            />
          </Source>

          <Marker latitude={origin.latitude} longitude={origin.longitude}>
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-brand-green border-2 border-brand-dark text-brand-dark text-xs font-black shadow-lg cursor-default">
              O
            </div>
          </Marker>

          <Marker latitude={destination.latitude} longitude={destination.longitude}>
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-brand-dark border-2 border-brand-green text-brand-cream text-xs font-black shadow-lg cursor-default">
              D
            </div>
          </Marker>

          <Popup
            latitude={origin.latitude}
            longitude={origin.longitude}
            closeButton={false}
            closeOnClick={false}
            maxWidth="220px"
          >
            <div className="font-sans text-sm font-bold text-brand-dark">
              {origin.iataCode} · {origin.city || origin.name}
              <br />
              <span className="text-[10px] text-gray-500 font-normal">{origin.name}</span>
            </div>
          </Popup>

          <Popup
            latitude={destination.latitude}
            longitude={destination.longitude}
            closeButton={false}
            closeOnClick={false}
            maxWidth="220px"
          >
            <div className="font-sans text-sm font-bold text-brand-dark">
              {destination.iataCode} · {destination.city || destination.name}
              <br />
              <span className="text-[10px] text-gray-500 font-normal">{destination.name}</span>
            </div>
          </Popup>
        </Map>
      </div>
    </div>
  );
}
