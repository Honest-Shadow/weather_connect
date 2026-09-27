import { useWeather } from '../context/useWeather';
import { WeatherIcon } from './WeatherIcon';
import { convertTemp, getWeatherCondition } from '../services/weatherApi';

export const CurrentWeatherHero = () => {
  const {
    currentCity,
    weatherData,
    unit,
    toggleSaveCity,
    isCurrentCitySaved,
  } = useWeather();

  if (!weatherData?.weather?.current) {
    return null;
  }

  const current = weatherData.weather.current;
  const daily = weatherData.weather.daily;

  const condition = getWeatherCondition(current.weather_code, current.is_day);

  const highTemp = daily?.temperature_2m_max ? daily.temperature_2m_max[0] : null;
  const lowTemp = daily?.temperature_2m_min ? daily.temperature_2m_min[0] : null;

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="hero-card">
      <div className="hero-content">
        {/* Top Header: City Name + Save Button */}
        <div className="hero-header">
          <div className="location-info">
            <div className="location-title-row">
              <h1 className="city-name">{currentCity?.name}</h1>
              {currentCity?.countryCode && (
                <span className="country-badge">{currentCity.countryCode}</span>
              )}
            </div>
            <p className="city-subtitle">
              {currentCity?.admin1 ? `${currentCity.admin1}, ` : ''}{currentCity?.country} • {todayFormatted}
            </p>
          </div>

          <button
            type="button"
            className={`save-city-btn ${isCurrentCitySaved ? 'saved' : ''}`}
            onClick={() => toggleSaveCity(currentCity)}
            title={isCurrentCitySaved ? 'Remove from Saved Cities' : 'Save to Favorites'}
          >
            <WeatherIcon
              name={isCurrentCitySaved ? 'star-filled' : 'star'}
              size={18}
            />
            <span>{isCurrentCitySaved ? 'Saved' : 'Save City'}</span>
          </button>
        </div>

        <div className="hero-body">
          <div className="temp-cluster">
            <div className="temp-display">
              <span className="temp-value">{convertTemp(current.temperature_2m, unit)}</span>
              <span className="temp-unit-symbol">°{unit}</span>
            </div>

            <div className="condition-row">
              <span className="condition-text">{condition.description}</span>
              <span className="separator">•</span>
              <span className="feels-like-text">
                Feels like {convertTemp(current.apparent_temperature, unit)}°{unit}
              </span>
            </div>

            <div className="high-low-badge">
              <span>H: {convertTemp(highTemp, unit)}°</span>
              <span className="divider">|</span>
              <span>L: {convertTemp(lowTemp, unit)}°</span>
            </div>
          </div>

          <div className="hero-icon-container">
            <WeatherIcon name={condition.icon} size={96} />
          </div>
        </div>
      </div>
    </div>
  );
};