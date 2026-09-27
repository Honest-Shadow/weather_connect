import { useState } from 'react';
import { WeatherProvider } from './context/WeatherContext.jsx';
import { useWeather } from './context/useWeather';
import { Navbar } from './components/Navbar';
import { CurrentWeatherHero } from './components/CurrentWeather';
import { FiveDayForecast } from './components/FiveDayForecast';
import { HourlyChart } from './components/HourlyChart';
import { WeatherMetricsGrid } from './components/WeatherMetricsGrid';
import { SavedCitiesModal } from './components/SavedCities';
import { SettingsModal } from './components/Settings';
import './App.css';

function MainApp() {
  const { weatherData, loading, error, currentCity, loadWeatherForCity } = useWeather();
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="app-wrapper">
      <Navbar
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="dashboard-main">
        {loading && (
          <div className="loading-state-card">
            <div className="spinner-sm"></div>
            <h3>Connecting to Meteorological Stations...</h3>
            <p>Gathering atmospheric and air quality telemetry</p>
          </div>
        )}

        {error && !loading && (
          <div className="error-state-card">
            <div className="error-icon"></div>
            <h3>Unable to Retrieve Weather</h3>
            <p>{error}</p>
            <button
              type="button"
              className="retry-btn"
              onClick={() => loadWeatherForCity(currentCity)}
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Loaded Dashboard Layout */}
        {!loading && !error && weatherData && (
          <div className="dashboard-grid-layout">
            <div className="dashboard-top-row">
              <div className="hero-column">
                <CurrentWeatherHero />
              </div>
              <div className="forecast-column">
                <FiveDayForecast />
              </div>
            </div>

            <div className="dashboard-chart-row">
              <HourlyChart />
            </div>

            <div className="dashboard-metrics-row">
              <WeatherMetricsGrid />
            </div>
          </div>
        )}
      </main>

      <SavedCitiesModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <footer className="dashboard-footer">
        <p>Weather Connect • Stay linked to the sky • Data powered by Open-Meteo & Copernicus</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <WeatherProvider>
      <MainApp />
    </WeatherProvider>
  );
}