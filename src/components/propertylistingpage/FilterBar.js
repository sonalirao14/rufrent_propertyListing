import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { fetchCities,fetchCommunities,fetchStatusOptions } from '../../services/newapiServices';

export function FilterBar({ onFilterChange }) {
  const [filters, setFilters] = useState({
    searchQuery: '',
    status: 'All Status',
    city: 'All City',
    community: 'All Community',
  })


  // {Updated api calling code using axios}
  const [cities, setCities] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCitiesAndStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        const [citiesData, statusData] = await Promise.all([fetchCities(), fetchStatusOptions()]);
        console.log("Cities Data:", citiesData); // Log fetched cities
        console.log("Status Options Data:", statusData); // Log fetched status options
  
        setCities(citiesData.result || []);
        setStatusOptions(statusData.result || []);
      } catch (err) {
        console.error("Error loading cities and status options:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCitiesAndStatus();
  }, []);

  useEffect(() => {
    const loadCommunities = async () => {
      try {
        setLoading(true);
        setError(null);

        const communityData = await fetchCommunities(filters.city);
        setCommunities(communityData.result || []);
      } catch (err) {
        console.error("Error loading communities:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCommunities();
  }, [filters.city]);

  const handleFilterChange = (key, value) => {
    let newFilters = { ...filters, [key]: value }
    if (key === 'city') {
      newFilters.community = 'All Community'
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }
  
  return (
    <div className="flex items-center gap-4 mb-6">
      <h2 className="text-lg font-semibold">Property Listings</h2>
      {/* Loading Indicator */}
      {loading && <p className="text-blue-500">Loading, please wait...</p>}

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-1 gap-4">
        <input
          type="text"
          placeholder="Search properties..."
          className="border rounded px-3 py-2 w-64"
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="All Status">All Status</option>
          {statusOptions && statusOptions.map((status) => (
            <option key={status.id} value={status.id}>{status.status_code}</option>
          ))}
        </select>
        <select
          className="border rounded px-3 py-2"
          value={filters.city}
          onChange={(e) => handleFilterChange('city', e.target.value)}
        >
          <option value="All City">All Cities</option>
          {cities && cities.map((city) => (
            <option key={city.id} value={city.id}>{city.name}</option>
          ))}
        </select>
        <select
          className="border rounded px-3 py-2"
          value={filters.community}
          onChange={(e) => {
            e.preventDefault();
            handleFilterChange('community', e.target.value);
          }}
          disabled={filters.city === 'All City'}
        >
          <option value="All Community">All Communities</option>
          {communities && communities.map((community) => (
            <option key={community.id} value={community.id}>{community.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

FilterBar.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
}

