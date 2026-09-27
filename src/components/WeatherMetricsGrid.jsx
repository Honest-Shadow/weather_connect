import { useWeather } from '../context/useWeather';
import { WeatherIcon } from './WeatherIcon';
import {
  convertSpeed,
  getWindDirection,
  getAqiDetails,
  getUvDetails,
} from '../services/weatherApi';

export const WeatherMetricsGrid = () => {
  const { weatherData, unit } = useWeather();

  if (!weatherData?.weather?.current) {
    return null;
  }

  const current = weatherData.weather.current;
  const daily = weatherData.weather.daily;
  const airQuality = weatherData.airQuality?.current;

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '--:--';
    }
  };

  const sunriseStr = daily?.sunrise ? formatTime(daily.sunrise[0]) : '--:--';
  const sunsetStr = daily?.sunset ? formatTime(daily.sunset[0]) : '--:--';

  const uvValue = daily?.uv_index_max ? daily.uv_index_max[0] : 0;
  const uvInfo = getUvDetails(uvValue);

  const aqiValue = airQuality?.european_aqi ?? airQuality?.us_aqi ?? 25;
  const aqiInfo = getAqiDetails(aqiValue);

  const humidity = current.relative_humidity_2m;
  let humidityText = 'Comfortable';
  if (humidity < 30) humidityText = 'Dry air';
  else if (humidity > 70) humidityText = 'Humid';

  const pressure = Math.round(current.surface_pressure || 1013);
  let pressureStatus = 'Normal';
  if (pressure < 1008) pressureStatus = 'Low (Stormy)';
  else if (pressure > 1022) pressureStatus = 'High (Fair)';

  return (
    <div className="metrics-section">
      <h2 className="section-title">Atmospheric Conditions</h2>
      
      <div className="bento-grid">
        <div className="bento-card">
          <div className="card-header">
            <span className="card-title">Wind</span>
            <WeatherIcon name="wind" size={20} color="#38bdf8" />
          </div>
          <div className="card-body">
            <span className="card-value">{convertSpeed(current.wind_speed_10m, unit)}</span>
            <div className="compass-row">
              <span
                className="compass-arrow"
                style={{ transform: `rotate(${current.wind_direction_10m || 0}deg)` }}
              >
                ▲
              </span>
              <span className="card-subtext">
                From {getWindDirection(current.wind_direction_10m)} ({Math.round(current.wind_direction_10m || 0)}°)
              </span>
            </div>
          </div>
        </div>

        <div className="bento-card">
          <div className="card-header">
            <span className="card-title">Humidity</span>
            <WeatherIcon name="humidity" size={20} color="#38bdf8" />
          </div>
          <div className="card-body">
            <span className="card-value">{humidity}%</span>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(100, humidity)}%`,
                  backgroundColor: humidity > 70 ? '#38bdf8' : '#10b981',
                }}
              />
            </div>
            <span className="card-subtext">{humidityText}</span>
          </div>
        </div>

        <div className="bento-card">
          <div className="card-header">
            <span className="card-title">UV Index</span>
            <WeatherIcon name="clear-day" size={20} color="#f59e0b" />
          </div>
          <div className="card-body">
            <div className="badge-row">
              <span className="card-value">{uvValue.toFixed(1)}</span>
              <span
                className="status-pill"
                style={{ backgroundColor: `${uvInfo.color}22`, color: uvInfo.color }}
              >
                {uvInfo.label}
              </span>
            </div>
            <span className="card-subtext">{uvInfo.advice || 'Standard daytime'}</span>
          </div>
        </div>

        <div className="bento-card">
          <div className="card-header">
            <span className="card-title">Air Quality</span>
            <WeatherIcon name="cloudy" size={20} color="#10b981" />
          </div>
          <div className="card-body">
            <div className="badge-row">
              <span className="card-value">{Math.round(aqiValue)} AQI</span>
              <span
                className="status-pill"
                style={{ backgroundColor: `${aqiInfo.color}22`, color: aqiInfo.color }}
              >
                {aqiInfo.label}
              </span>
            </div>
            <div className="pollutants-row">
              <span>PM2.5: {airQuality?.pm2_5 ? Math.round(airQuality.pm2_5) : 12} µg/m³</span>
              <span>PM10: {airQuality?.pm10 ? Math.round(airQuality.pm10) : 22} µg/m³</span>
            </div>
          </div>
        </div>

        <div className="bento-card">
          <div className="card-header">
            <span className="card-title">Pressure</span>
            <WeatherIcon name="pressure" size={20} color="#38bdf8" />
          </div>
          <div className="card-body">
            <span className="card-value">{pressure} <small className="unit-small">hPa</small></span>
            <span className="card-subtext">{pressureStatus} barometer</span>
          </div>
        </div>

        <div className="bento-card">
          <div className="card-header">
            <span className="card-title">Sun Schedule</span>
            <WeatherIcon name="sunrise" size={20} color="#f59e0b" />
          </div>
          <div className="card-body sun-times-body">
            <div className="sun-time-block">
              <WeatherIcon name="sunrise" size={24} color="#f59e0b" />
              <div>
                <span className="sun-label">Sunrise</span>
                <span className="sun-time">{sunriseStr}</span>
              </div>
            </div>
            <div className="sun-divider" />
            <div className="sun-time-block">
              <WeatherIcon name="sunset" size={24} color="#f97316" />
              <div>
                <span className="sun-label">Sunset</span>
                <span className="sun-time">{sunsetStr}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};