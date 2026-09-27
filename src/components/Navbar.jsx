import { useState, useEffect, useRef } from 'react';
import { useWeather } from '../context/useWeather';
import { WeatherIcon } from './WeatherIcon';
import logoImg from '../assets/logo.jpg';

export const Navbar = ({ onOpenSaved, onOpenSettings }) => {
  const {
    unit,
    toggleUnit,
    selectCity,
    searchCities,
    recentSearches,
    savedCities,
  } = useWeather();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // 1. Debounced Search Effect
  useEffect(() => {
    // If input is empty or less than 2 letters, don't search
    if (!query.trim() || query.trim().length < 2) {
      return;
    }

    let isCancelled = false;

    // Wait 350ms after user stops typing
    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchCities(query);
        if (!isCancelled) {
          setSuggestions(results);
        }
      } catch (err) {
        console.error('Search error:', err);
        if (!isCancelled) setSuggestions([]);
      } finally {
        if (!isCancelled) setIsSearching(false);
      }
    }, 350);

    // Cleanup: cancel the timer if user types another letter before 350ms
    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [query, searchCities]);

  // 2. Click-Outside to Close Dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // When user types in search box
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (!val.trim() || val.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
    }
    setShowDropdown(true);
  };

  // When user clicks a city from dropdown
  const handleSelectCity = (city) => {
    selectCity(city);
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        <div className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={logoImg} alt="Weather Connect" className="brand-logo-img" />
            <div className="brand-text-block">
                <span className="brand-title">WEATHER CONNECT</span>
                <span className="brand-tagline">Stay linked to the sky</span>
            </div>
        </div>

        <div className="search-wrapper" ref={dropdownRef}>
          <div className="search-input-box">
            <WeatherIcon name="search" size={18} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search Lagos, Abuja, London..."
              value={query}
              onChange={handleInputChange}
              onFocus={() => setShowDropdown(true)}
            />
            {query && (
              <button
                type="button"
                className="clear-btn"
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                  setIsSearching(false);
                }}
              >
                <WeatherIcon name="close" size={16} />
              </button>
            )}
          </div>

          {showDropdown && (
            <div className="search-dropdown">
              {isSearching && (
                <div className="dropdown-message">Searching locations...</div>
              )}

              {!isSearching && suggestions.length > 0 && (
                <div className="dropdown-section">
                  <span className="dropdown-label">Locations</span>
                  {suggestions.map((city) => (
                    <div
                      key={city.id}
                      className="dropdown-item"
                      onClick={() => handleSelectCity(city)}
                    >
                      <span className="dropdown-city-name">{city.name}</span>
                      <span className="dropdown-city-sub">
                        {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {!isSearching && query.trim().length >= 2 && suggestions.length === 0 && (
                <div className="dropdown-message">No cities found for "{query}"</div>
              )}

              {recentSearches.length > 0 && (
                <div className="dropdown-section">
                  <span className="dropdown-label">Recent Searches</span>
                  <div className="recent-chips">
                    {recentSearches.map((city) => (
                      <button
                        key={city.id || city.name}
                        type="button"
                        className="recent-chip"
                        onClick={() => handleSelectCity(city)}
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="navbar-actions">
          <div className="unit-toggle" onClick={toggleUnit} title="Switch °C / °F">
            <span className={`unit-pill ${unit === 'C' ? 'active' : ''}`}>°C</span>
            <span className={`unit-pill ${unit === 'F' ? 'active' : ''}`}>°F</span>
          </div>

          <button
            type="button"
            className="saved-cities-btn"
            onClick={onOpenSaved}
            title="View Saved Cities"
          >
            <WeatherIcon name="star-filled" size={18} />
            <span className="saved-count">{savedCities.length}</span>
            <span className="saved-text">Saved</span>
          </button>

          <button
            type="button"
            className="settings-btn"
            onClick={onOpenSettings}
            title="Settings & Preferences"
          >
            <WeatherIcon name="settings" size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};