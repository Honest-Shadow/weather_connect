import { useState, useEffect } from 'react';
import { useWeather } from '../context/useWeather';
import { WeatherIcon } from './WeatherIcon';
import { fetchMiniWeather, convertTemp, getWeatherCondition } from '../services/weatherApi';

export const SavedCitiesModal = ({ isOpen, onClose }) => {
  const {
    savedCities,
    removeSavedCity,
    selectCity,
    currentCity,
    toggleSaveCity,
    unit,
  } = useWeather();

  const [miniWeathers, setMiniWeathers] = useState({});
  const [loadingMini, setLoadingMini] = useState(false);

  // Fetch mini weather for all saved cities when modal opens
  useEffect(() => {
    if (!isOpen || savedCities.length === 0) return;

    let isMounted = true;

    const loadAllMini = async () => {
      setLoadingMini(true);
      const results = {};
      await Promise.all(
        savedCities.map(async (city) => {
          try {
            const data = await fetchMiniWeather(city.latitude, city.longitude);
            if (data) results[city.id] = data;
          } catch (e) {
            console.error('Failed to load mini weather for', city.name, e);
          }
        })
      );

      if (isMounted) {
        setMiniWeathers(results);
        setLoadingMini(false);
      }
    };

    loadAllMini();

    return () => {
      isMounted = false;
    };
  }, [isOpen, savedCities]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <WeatherIcon name="star-filled" size={22} />
            <h2>Saved Locations</h2>
            <span className="saved-badge">{savedCities.length}</span>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <WeatherIcon name="close" size={20} />
          </button>
        </div>

        <div className="modal-body">
          {savedCities.length === 0 ? (
            <div className="empty-state">
              <WeatherIcon name="star" size={42} color="#64748b" />
              <h3>No Saved Cities Yet</h3>
              <p>Bookmark your favorite cities for quick 1-click access anytime.</p>
              {currentCity && (
                <button
                  type="button"
                  className="save-current-btn"
                  onClick={() => toggleSaveCity(currentCity)}
                >
                  Save {currentCity.name} Now
                </button>
              )}
            </div>
          ) : (
            <div className="saved-list">
              {savedCities.map((city) => {
                const mini = miniWeathers[city.id];
                const cond = mini ? getWeatherCondition(mini.weatherCode, mini.isDay) : null;
                const isCurrent = currentCity?.name?.toLowerCase() === city.name?.toLowerCase();

                return (
                  <div
                    key={city.id}
                    className={`saved-card ${isCurrent ? 'active-city' : ''}`}
                    onClick={() => {
                      selectCity(city);
                      onClose();
                    }}
                  >
                    <div className="saved-card-info">
                      <div className="saved-card-title-row">
                        <span className="saved-city-name">{city.name}</span>
                        {isCurrent && <span className="active-tag">Active</span>}
                      </div>
                      <span className="saved-city-region">
                        {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                      </span>
                    </div>

                    <div className="saved-card-right">
                      {mini && cond ? (
                        <>
                          <WeatherIcon name={cond.icon} size={26} />
                          <span className="saved-temp">
                            {convertTemp(mini.temp, unit)}°{unit}
                          </span>
                        </>
                      ) : loadingMini ? (
                        <span className="loading-mini">...</span>
                      ) : (
                        <span className="saved-temp">--</span>
                      )}

                      <button
                        type="button"
                        className="delete-city-btn"
                        title="Remove city"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSavedCity(city.id);
                        }}
                      >
                        <WeatherIcon name="trash" size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};