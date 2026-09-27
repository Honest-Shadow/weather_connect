import { useContext } from 'react';
import { WeatherContext } from './weatherContext.js';

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used inside a WeatherProvider');
  }
  return context;
};