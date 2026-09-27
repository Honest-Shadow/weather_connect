import { useState, useEffect, useCallback } from 'react';
import { WeatherContext } from './weatherContext.js';
import {
  fetchWeatherData,
  searchCities,
} from '../services/weatherApi';

const DEFAULT_CITY = {
  id: 'default_lagos',
  name: 'Lagos',
  country: 'Nigeria',
  admin1: 'Lagos State',
  latitude: 6.5244,
  longitude: 3.3792,
  timezone: 'Africa/Lagos',
  countryCode: 'NG',
};

export const WeatherProvider = ({ children }) => {
  const [unit, setUnitState] = useState(() => {
    return localStorage.getItem('app_weather_unit') || 'C';
  });

  const [currentCity, setCurrentCity] = useState(() => {
    const saved = localStorage.getItem('app_last_city');
    return saved ? JSON.parse(saved) : DEFAULT_CITY;
  });

  const [savedCities, setSavedCities] = useState(() => {
    const saved = localStorage.getItem('app_saved_cities');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: 'Tokyo',
        country: 'Japan',
        latitude: 35.6895,
        longitude: 139.6917,
        countryCode: 'JP'
      },
      {
        id: '2',
        name: 'New York',
        country: 'United States',
        latitude: 40.7128,
        longitude: -74.0060,
        countryCode: 'US'
      },
      {
        id: 'city_lagos',
        name: 'Lagos',
        country: 'Nigeria',
        admin1: 'Lagos State',
        latitude: 6.5244,
        longitude: 3.3792,
        countryCode: 'NG',
      },
      {
        id: 'city_abuja',
        name: 'Abuja',
        country: 'Nigeria',
        admin1: 'FCT',
        latitude: 9.0765,
        longitude: 7.3986,
        countryCode: 'NG',
      },
    ];
  });

  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('app_recents');
    return saved ? JSON.parse(saved) : [];
  });

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleUnit = () => {
    setUnitState((prev) => {
      const nextUnit = prev === 'C' ? 'F' : 'C';
      localStorage.setItem('app_weather_unit', nextUnit);
      return nextUnit;
    });
  };

  const loadWeatherForCity = useCallback(async (city) => {
    if (!city?.latitude || !city?.longitude) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(city.latitude, city.longitude, city.timezone);
      setWeatherData(data);
      setCurrentCity(city);
      localStorage.setItem('app_last_city', JSON.stringify(city));
    } catch (err) {
      setError(err.message || 'Unable to retrieve weather data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const load = async () => {
      try {
        const data = await fetchWeatherData(currentCity.latitude, currentCity.longitude, currentCity.timezone);
        if (!isCancelled) {
          setWeatherData(data);
          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'Unable to load weather data.');
          setLoading(false);
        }
      }
    };
    load();
    return () => { isCancelled = true; };
  }, [currentCity]);

  const selectCity = (city) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.name !== city.name);
      const updated = [city, ...filtered].slice(0, 6);
      localStorage.setItem('app_recents', JSON.stringify(updated));
      return updated;
    });

    loadWeatherForCity(city);
  };

  const toggleSaveCity = (cityToSave) => {
    const target = cityToSave || currentCity;
    setSavedCities((prev) => {
      const exists = prev.some((c) => c.name.toLowerCase() === target.name.toLowerCase());
      let updated;
      if (exists) {
        updated = prev.filter((c) => c.name.toLowerCase() !== target.name.toLowerCase());
      } else {
        updated = [target, ...prev];
      }
      localStorage.setItem('app_saved_cities', JSON.stringify(updated));
      return updated;
    });
  };

  const isCurrentCitySaved = Boolean(
    currentCity && savedCities.some((c) => c.name.toLowerCase() === currentCity.name.toLowerCase())
  );

  const removeSavedCity = (id) => {
    setSavedCities((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      localStorage.setItem('app_saved_cities', JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('app_recents');
  };

  return (
    <WeatherContext.Provider
      value={{
        unit,
        toggleUnit,
        currentCity,
        weatherData,
        loading,
        error,
        savedCities,
        toggleSaveCity,
        isCurrentCitySaved,
        removeSavedCity,
        recentSearches,
        clearRecentSearches,
        selectCity,
        loadWeatherForCity,
        searchCities,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};