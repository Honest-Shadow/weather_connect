import { useWeather } from '../context/useWeather';
import { WeatherIcon } from './WeatherIcon';
import { convertTemp, getWeatherCondition } from '../services/weatherApi';

export const FiveDayForecast = () => {
  const { weatherData, unit } = useWeather();

  if (!weatherData?.weather?.daily) {
    return null;
  }

  const daily = weatherData.weather.daily;
  const days = [];

  const allMins = daily.temperature_2m_min.slice(0, 5);
  const allMaxs = daily.temperature_2m_max.slice(0, 5);
  const weekMin = Math.min(...allMins);
  const weekMax = Math.max(...allMaxs);
  const range = weekMax - weekMin || 1;

  for (let i = 0; i < 5 && i < daily.time.length; i++) {
    const date = new Date(daily.time[i] + 'T00:00:00');
    const isToday = i === 0;
    const weekday = isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const condition = getWeatherCondition(daily.weather_code[i], 1);
    const minC = daily.temperature_2m_min[i];
    const maxC = daily.temperature_2m_max[i];
    const rainProb = daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0;

    const leftPercent = Math.max(0, ((minC - weekMin) / range) * 100);
    const widthPercent = Math.max(12, ((maxC - minC) / range) * 100);

    days.push({
      id: daily.time[i],
      weekday,
      formattedDate,
      isToday,
      condition,
      minTemp: convertTemp(minC, unit),
      maxTemp: convertTemp(maxC, unit),
      rainProb,
      barLeft: `${leftPercent}%`,
      barWidth: `${widthPercent}%`,
    });
  }

  return (
    <div className="forecast-card">
      <h2 className="section-title">5-Day Outlook</h2>
      <div className="forecast-list">
        {days.map((day) => (
          <div key={day.id} className={`forecast-row ${day.isToday ? 'is-today' : ''}`}>
            <div className="day-col">
              <span className="day-name">{day.weekday}</span>
              <span className="day-date">{day.formattedDate}</span>
            </div>

            <div className="condition-col">
              <WeatherIcon name={day.condition.icon} size={24} />
              <div className="condition-text-block">
                <span className="condition-desc">{day.condition.description}</span>
                {day.rainProb > 0 && (
                  <span className="rain-chance">💧 {day.rainProb}% rain</span>
                )}
              </div>
            </div>

            <div className="temp-range-col">
              <span className="temp-min">{day.minTemp}°</span>
              <div className="range-track">
                <div
                  className="range-fill"
                  style={{ left: day.barLeft, width: day.barWidth }}
                />
              </div>
              <span className="temp-max">{day.maxTemp}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};