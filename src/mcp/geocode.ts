export interface GeocodedLocation {
  name: string;
  lat: number;
  lng: number;
  type: string;
  displayName: string;
}

export async function geocode(query: string): Promise<GeocodedLocation[]> {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', query);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '5');
  url.searchParams.set('addressdetails', '1');

  const response = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'twimp-mcp-server/0.1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Geocoding failed: ${response.statusText}`);
  }

  const results = await response.json() as Array<{
    display_name: string;
    lat: string;
    lon: string;
    type: string;
    name: string;
  }>;

  return results.map((r) => ({
    name: r.name || r.display_name.split(',')[0],
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
    type: r.type,
    displayName: r.display_name,
  }));
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('lat', lat.toString());
  url.searchParams.set('lon', lng.toString());
  url.searchParams.set('format', 'json');

  const response = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'twimp-mcp-server/0.1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Reverse geocoding failed: ${response.statusText}`);
  }

  const result = await response.json() as { display_name: string };
  return result.display_name;
}
