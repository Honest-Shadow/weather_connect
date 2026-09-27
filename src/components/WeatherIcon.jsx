import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  Snowflake,
  CloudFog,
  Wind,
  Droplets,
  Gauge,
  Sunrise,
  Sunset,
  Search,
  MapPin,
  Star,
  Trash2,
  X,
  Compass,
  Settings,
} from 'lucide-react';

export const WeatherIcon = ({ name, size = 24, className = '', color }) => {
  const props = { size, className, color };

  switch (name) {
    case 'clear-day':
      return <Sun {...props} color={color || '#F59E0B'} />;
    case 'clear-night':
      return <Moon {...props} color={color || '#CBD5E1'} />;
    case 'partly-cloudy-day':
      return <CloudSun {...props} color={color || '#38BDF8'} />;
    case 'partly-cloudy-night':
      return <CloudMoon {...props} color={color || '#94A3B8'} />;
    case 'cloudy':
      return <Cloud {...props} color={color || '#94A3B8'} />;
    case 'drizzle':
      return <CloudDrizzle {...props} color={color || '#38BDF8'} />;
    case 'rain':
    case 'rain-heavy':
      return <CloudRain {...props} color={color || '#0284C7'} />;
    case 'thunderstorm':
      return <CloudLightning {...props} color={color || '#FACC15'} />;
    case 'snow':
      return <Snowflake {...props} color={color || '#BAE6FD'} />;
    case 'fog':
      return <CloudFog {...props} color={color || '#94A3B8'} />;
    case 'wind':
      return <Wind {...props} />;
    case 'humidity':
      return <Droplets {...props} color={color || '#38BDF8'} />;
    case 'pressure':
      return <Gauge {...props} />;
    case 'sunrise':
      return <Sunrise {...props} color={color || '#F59E0B'} />;
    case 'sunset':
      return <Sunset {...props} color={color || '#F97316'} />;
    case 'compass':
      return <Compass {...props} />;
    case 'search':
      return <Search {...props} />;
    case 'gps':
    case 'location':
      return <MapPin {...props} />;
    case 'star':
      return <Star {...props} />;
    case 'star-filled':
      return <Star {...props} fill="#F59E0B" color="#F59E0B" />;
    case 'trash':
      return <Trash2 {...props} />;
    case 'close':
      return <X {...props} />;
    case 'settings':
      return <Settings {...props} />;
    default:
      return <Cloud {...props} />;
  }
};