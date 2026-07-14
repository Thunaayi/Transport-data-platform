'use client';

import { useEffect, useState, useRef } from 'react';
import Map, { Source, Layer, Marker, Popup, MapRef } from 'react-map-gl/maplibre';

interface Stop {
  stopOrder: number;
  nameEnglish: string;
  latitude: number | null;
  longitude: number | null;
}

interface Props {
  stops: Stop[];
  routeName: string;
  className?: string;
}

export default function BusRouteMap({ stops, routeName, className }: Props) {
  const mapRef = useRef<MapRef>(null);
  const [routePath, setRoutePath] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [popupStop, setPopupStop] = useState<Stop | null>(null);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const coords = stops
      .filter(s => s.latitude && s.longitude)
      .map(s => ({ lat: s.latitude!, lng: s.longitude! }));

    if (coords.length < 2) {
      setLoading(false);
      return;
    }

    fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/api/routes/osm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ waypoints: coords }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Route fetch failed');
        return res.json() as Promise<{ path: [number, number][] }>;
      })
      .then(data => {
        setRoutePath(data.path.map(([lng, lat]) => [lng, lat]));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [stops]);

  useEffect(() => {
    if (!loading && !error && validStops.length > 0 && mapRef.current) {
      const lngs = validStops.map(s => s.longitude!);
      const lats = validStops.map(s => s.latitude!);
      mapRef.current.fitBounds(
        [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
        { padding: 50, maxZoom: 16 }
      );
    }
  }, [loading, error]);

  const validStops = stops.filter(s => s.latitude && s.longitude);

  if (validStops.length === 0) return (
    <div className={`flex items-center justify-center bg-brand-cream ${className || 'h-[400px]'}`}>
      <p className="font-mono text-xs text-brand-dark/50 uppercase tracking-widest">No stops with coordinates</p>
    </div>
  );

  const lineGeoJson = routePath.length > 0 ? {
    type: 'Feature' as const,
    geometry: { type: 'LineString' as const, coordinates: routePath },
    properties: {},
  } : null;

  return (
    <div className={`relative bg-white overflow-hidden ${className || 'border-4 border-brand-dark h-[400px]'}`}>
      <div className="absolute top-3 left-3 z-10 bg-brand-cream border-2 border-brand-dark px-3 py-1.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark">
          {routeName} · Route Map
        </span>
      </div>

      {loading && (
        <div className="flex items-center justify-center bg-brand-cream/80 min-h-[300px]">
          <div className="font-mono text-brand-dark/50 animate-pulse uppercase tracking-widest text-sm">
            Loading route map...
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center bg-brand-cream/80 min-h-[300px]">
          <div className="font-mono text-red-600 text-xs uppercase tracking-widest">
            Map unavailable
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="w-full h-full min-h-[300px]">
          <Map
            ref={mapRef}
            initialViewState={{
              latitude: validStops[0].latitude!,
              longitude: validStops[0].longitude!,
              zoom: 13,
            }}
            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            style={{ width: '100%', height: '100%' }}
            attributionControl={false}
          >
            {lineGeoJson && (
              <Source id="route" type="geojson" data={lineGeoJson}>
                <Layer
                  id="route-line"
                  type="line"
                  paint={{
                    'line-color': '#183c28',
                    'line-width': 4,
                    'line-opacity': 0.8,
                  }}
                />
              </Source>
            )}

            {validStops.map((stop, i) => {
              const isStart = i === 0;
              const isEnd = i === validStops.length - 1;
              return (
                <Marker
                  key={stop.stopOrder}
                  latitude={stop.latitude!}
                  longitude={stop.longitude!}
                  onClick={e => {
                    e.originalEvent.stopPropagation();
                    setPopupStop(stop);
                  }}
                >
                  <div
                    className={`flex items-center justify-center rounded-full border-2 text-[10px] font-black cursor-pointer transition-transform hover:scale-110 ${
                      isStart
                        ? 'w-5 h-5 bg-brand-green border-brand-dark text-brand-dark'
                        : isEnd
                        ? 'w-5 h-5 bg-brand-dark border-brand-green text-brand-cream'
                        : 'w-4 h-4 bg-brand-dark border-brand-cream shadow-[0_0_0_2px_#183c28]'
                    }`}
                  >
                    {(isStart || isEnd) && (isStart ? 'S' : 'E')}
                  </div>
                </Marker>
              );
            })}

            {popupStop && (
              <Popup
                latitude={popupStop.latitude!}
                longitude={popupStop.longitude!}
                onClose={() => setPopupStop(null)}
                closeButton={false}
                maxWidth="240px"
              >
                <div className="font-sans text-sm font-bold text-brand-dark">
                  {popupStop.nameEnglish}
                  <br />
                  <span className="text-[10px] text-gray-500 font-normal">Stop #{popupStop.stopOrder}</span>
                </div>
              </Popup>
            )}
          </Map>
        </div>
      )}
    </div>
  );
}
