import { useState } from 'react';
import { useWeather } from '../context/useWeather';
import { WeatherIcon } from './WeatherIcon';
import { convertTemp, getWeatherCondition } from '../services/weatherApi';

export const HourlyChart = () => {
  const { weatherData, unit } = useWeather();
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!weatherData?.weather?.hourly) {
    return null;
  }

  const hourly = weatherData.weather.hourly;
  const currentHour = new Date().getHours();

  const hoursData = [];
  for (let i = currentHour; i < currentHour + 24 && i < hourly.time.length; i++) {
    const timeStr = hourly.time[i];
    const date = new Date(timeStr);
    const temp = hourly.temperature_2m[i];
    const code = hourly.weather_code[i];
    const isDay = hourly.is_day[i];
    const rainProb = hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0;

    hoursData.push({
      time: date.toLocaleTimeString([], { hour: 'numeric', hour12: true }),
      isoTime: timeStr,
      temp,
      convertedTemp: convertTemp(temp, unit),
      condition: getWeatherCondition(code, isDay),
      rainProb,
      isNow: i === currentHour,
    });
  }

  if (hoursData.length === 0) return null;

  const chartHeight = 110;
  const chartWidth = 720;
  const paddingX = 24;
  const paddingY = 20;

  const temps = hoursData.map((d) => d.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = maxTemp - minTemp || 1;

  const points = hoursData.map((d, index) => {
    const x = paddingX + (index / (hoursData.length - 1)) * (chartWidth - 2 * paddingX);
    const y = chartHeight - paddingY - ((d.temp - minTemp) / tempRange) * (chartHeight - 2 * paddingY);
    return { ...d, x, y };
  });

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const midX = (p1.x + p2.x) / 2;
    pathD += ` Q ${p1.x} ${p1.y}, ${midX} ${(p1.y + p2.y) / 2} T ${p2.x} ${p2.y}`;
  }

  const fillD = `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;
  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : points[0];

  return (
    <div className="hourly-card">
      <div className="hourly-header">
        <div>
          <h2 className="section-title">24-Hour Trend</h2>
          <span className="section-subtitle">Interactive hourly temperature and precipitation</span>
        </div>
        {activePoint && (
          <div className="active-hour-pill">
            <span className="pill-time">{activePoint.isNow ? 'Now' : activePoint.time}:</span>
            <span className="pill-temp">{activePoint.convertedTemp}°{unit}</span>
            <span className="pill-desc">{activePoint.condition.description}</span>
            {activePoint.rainProb > 0 && <span className="pill-rain">💧 {activePoint.rainProb}%</span>}
          </div>
        )}
      </div>

      <div className="svg-container">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="hourly-svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={fillD} fill="url(#areaGradient)" />
          <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="3" />

          {points.map((pt, idx) => (
            <circle
              key={pt.isoTime}
              cx={pt.x}
              cy={pt.y}
              r={hoveredIdx === idx ? 6 : (pt.isNow ? 4 : 2.5)}
              fill={hoveredIdx === idx ? '#f59e0b' : '#ffffff'}
              stroke="#0284c7"
              strokeWidth="2"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredIdx(idx)}
            />
          ))}
        </svg>

        <div className="hourly-row-scroll">
          {points.map((pt, idx) => (
            <div
              key={pt.isoTime}
              className={`hour-item ${hoveredIdx === idx ? 'hovered' : ''} ${pt.isNow ? 'active-hour' : ''}`}
              onMouseEnter={() => setHoveredIdx(idx)}
            >
              <span className="hour-time">{pt.isNow ? 'Now' : pt.time}</span>
              <WeatherIcon name={pt.condition.icon} size={22} />
              <span className="hour-temp">{pt.convertedTemp}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};