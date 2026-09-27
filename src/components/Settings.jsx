import { useWeather } from '../context/useWeather';
import { WeatherIcon } from './WeatherIcon';

export const SettingsModal = ({ isOpen, onClose }) => {
  const {
    unit,
    toggleUnit,
    recentSearches,
    clearRecentSearches,
    savedCities,
  } = useWeather();

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <h2>Preferences & Status</h2>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <WeatherIcon name="close" size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="settings-group">
            <span className="settings-label">Temperature Scale</span>
            <div className="settings-toggle-row">
              <button
                type="button"
                className={`toggle-choice ${unit === 'C' ? 'selected' : ''}`}
                onClick={() => { if (unit !== 'C') toggleUnit(); }}
              >
                Celsius (°C)
              </button>
              <button
                type="button"
                className={`toggle-choice ${unit === 'F' ? 'selected' : ''}`}
                onClick={() => { if (unit !== 'F') toggleUnit(); }}
              >
                Fahrenheit (°F)
              </button>
            </div>
            <p className="settings-hint">
              Controls temperature readings across current, hourly, and 5-day forecast displays.
            </p>
          </div>

          <div className="settings-group">
            <span className="settings-label">Live Meteorological Endpoints</span>
            <div className="api-list">
              <div className="api-item">
                <span className="status-dot online" />
                <span className="api-name">Open-Meteo Geocoding API</span>
                <span className="api-tag">Online</span>
              </div>
              <div className="api-item">
                <span className="status-dot online" />
                <span className="api-name">Atmospheric Forecast & Hourly API</span>
                <span className="api-tag">Online</span>
              </div>
              <div className="api-item">
                <span className="status-dot online" />
                <span className="api-name">Copernicus Air Quality (AQI) API</span>
                <span className="api-tag">Online</span>
              </div>
            </div>
          </div>

          <div className="settings-group">
            <span className="settings-label">Local Data & History</span>
            <div className="storage-stats">
              <span>Saved Cities: <strong>{savedCities.length}</strong></span>
              <span>Recent Searches: <strong>{recentSearches.length}</strong></span>
            </div>
            {recentSearches.length > 0 && (
              <button
                type="button"
                className="clear-history-btn"
                onClick={clearRecentSearches}
              >
                Clear Search History
              </button>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="done-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};