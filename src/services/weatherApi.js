const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export const WEATHER_CODES = {
  0: { description: 'Clear sky', icon: 'clear-day', nightIcon: 'clear-night' },
  1: { description: 'Mainly clear', icon: 'partly-cloudy-day', nightIcon: 'partly-cloudy-night' },
  2: { description: 'Partly cloudy', icon: 'partly-cloudy-day', nightIcon: 'partly-cloudy-night' },
  3: { description: 'Overcast', icon: 'cloudy', nightIcon: 'cloudy' },
  45: { description: 'Foggy', icon: 'fog', nightIcon: 'fog' },
  48: { description: 'Depositing rime fog', icon: 'fog', nightIcon: 'fog' },
  51: { description: 'Light drizzle', icon: 'drizzle', nightIcon: 'drizzle' },
  53: { description: 'Moderate drizzle', icon: 'drizzle', nightIcon: 'drizzle' },
  55: { description: 'Dense drizzle', icon: 'drizzle', nightIcon: 'drizzle' },
  56: { description: 'Freezing drizzle', icon: 'snow', nightIcon: 'snow' },
  57: { description: 'Dense freezing drizzle', icon: 'snow', nightIcon: 'snow' },
  61: { description: 'Slight rain', icon: 'rain', nightIcon: 'rain' },
  63: { description: 'Moderate rain', icon: 'rain', nightIcon: 'rain' },
  65: { description: 'Heavy rain', icon: 'rain-heavy', nightIcon: 'rain-heavy' },
  66: { description: 'Freezing rain', icon: 'snow', nightIcon: 'snow' },
  67: { description: 'Heavy freezing rain', icon: 'snow', nightIcon: 'snow' },
  71: { description: 'Slight snow fall', icon: 'snow', nightIcon: 'snow' },
  73: { description: 'Moderate snow fall', icon: 'snow', nightIcon: 'snow' },
  75: { description: 'Heavy snow fall', icon: 'snow', nightIcon: 'snow' },
  77: { description: 'Snow grains', icon: 'snow', nightIcon: 'snow' },
  80: { description: 'Slight rain showers', icon: 'rain', nightIcon: 'rain' },
  81: { description: 'Moderate rain showers', icon: 'rain', nightIcon: 'rain' },
  82: { description: 'Violent rain showers', icon: 'rain-heavy', nightIcon: 'rain-heavy' },
  85: { description: 'Slight snow showers', icon: 'snow', nightIcon: 'snow' },
  86: { description: 'Heavy snow showers', icon: 'snow', nightIcon: 'snow' },
  95: { description: 'Thunderstorm', icon: 'thunderstorm', nightIcon: 'thunderstorm' },
  96: { description: 'Thunderstorm with slight hail', icon: 'thunderstorm', nightIcon: 'thunderstorm' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'thunderstorm', nightIcon: 'thunderstorm' },
};

export const getWeatherCondition = (code, isDay = 1) => {
  const info = WEATHER_CODES[code] || { description: 'Unknown', icon: 'cloudy', nightIcon: 'cloudy' };
  return {
    description: info.description,
    icon: isDay ? info.icon : (info.nightIcon || info.icon),
  };
};

export const searchCities = async (query) => {
  if (!query || query.trim().length < 2) return [];
  const res = await fetch(`${GEO_URL}?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`);
  if (!res.ok) throw new Error('Failed to find locations');

  const data = await res.json();
  if (!data.results) return [];

  return data.results.map((item) => ({
    id: `${item.id}`,
    name: item.name,
    country: item.country || '',
    admin1: item.admin1 || '',
    latitude: item.latitude,
    longitude: item.longitude,
    timezone: item.timezone || 'auto',
    countryCode: item.country_code ? item.country_code.toUpperCase() : '',
  }));
};

export const fetchWeatherData = async (latitude, longitude, timezone = 'auto') => {
  const weatherParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'weather_code',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'precipitation_probability',
      'weather_code',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_probability_max',
    ].join(','),
    timezone: timezone || 'auto',
    forecast_days: '7',
  });

  const aqiParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: ['european_aqi', 'us_aqi', 'pm10', 'pm2_5'].join(','),
    timezone: timezone || 'auto',
  });


  const [weatherRes, aqiRes] = await Promise.all([
    fetch(`${FORECAST_URL}?${weatherParams.toString()}`),
    fetch(`${AIR_QUALITY_URL}?${aqiParams.toString()}`).catch(() => null),
  ]);

  if (!weatherRes.ok) {
    throw new Error('Weather data fetch failed');
  }

  const weather = await weatherRes.json();
  let aqi = null;
  if (aqiRes && aqiRes.ok) {
    try {
      aqi = await aqiRes.json();
    } catch {
      aqi = null;
    }
  }

  return {
    weather,
    airQuality: aqi,
  };
};

export const convertTemp = (celsius, unit = 'C') => {
  if (celsius === undefined || celsius === null || isNaN(celsius)) return '--';
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
};

export const convertSpeed = (kmh, unit = 'C') => {
  if (kmh === undefined || kmh === null || isNaN(kmh)) return '--';
  if (unit === 'F') {
    return `${Math.round(kmh * 0.621371)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
};

export const getWindDirection = (degrees) => {
  if (degrees === undefined || degrees === null) return 'N/A';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

export const getAqiDetails = (aqi) => {
  const val = Number(aqi) || 0;
  if (val <= 50) return { label: 'Good', color: '#10b981' };
  if (val <= 100) return { label: 'Moderate', color: '#f59e0b' };
  if (val <= 150) return { label: 'Unhealthy for Sensitive', color: '#f97316' };
  if (val <= 200) return { label: 'Unhealthy', color: '#ef4444' };
  if (val <= 300) return { label: 'Very Unhealthy', color: '#8b5cf6' };
  return { label: 'Hazardous', color: '#991b1b' };
};

export const getUvDetails = (uv) => {
  const val = Number(uv) || 0;
  if (val <= 2) return { label: 'Low', color: '#10b981', advice: 'No protection required' };
  if (val <= 5) return { label: 'Moderate', color: '#f59e0b', advice: 'Wear sunglasses & SPF 30+' };
  if (val <= 7) return { label: 'High', color: '#f97316', advice: 'Cover up & seek shade midday' };
  if (val <= 10) return { label: 'Very High', color: '#ef4444', advice: 'Extra protection; avoid midday sun' };
  return { label: 'Extreme', color: '#8b5cf6', advice: 'Avoid sun; full protection essential' };
};

export const fetchMiniWeather = async (latitude, longitude) => {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: ['temperature_2m', 'weather_code', 'is_day'].join(','),
  });

  const res = await fetch(`${FORECAST_URL}?${params.toString()}`);
  if (!res.ok) throw new Error('Mini weather fetch failed');
  const data = await res.json();

  return {
    temp: data.current?.temperature_2m,
    weatherCode: data.current?.weather_code,
    isDay: data.current?.is_day ?? 1,
  };
};

export const detectCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      { timeout: 10000 }
    );
  });
};