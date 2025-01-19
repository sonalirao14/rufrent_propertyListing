import { useState } from 'react'
import { fetchProperties,updatePropertyStatus } from '../../../services/newapiServices';

export function PropertyData() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async (filters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProperties(filters);
      setProperties(data.results || []); // Ensure properties is always an array
    } catch (err) {
      console.error('Error fetching properties:', err);
      setProperties([]);
      setError('Failed to fetch properties.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (propertyId, newStatusCode) => {
    try {
      await updatePropertyStatus(propertyId, newStatusCode);
      await fetchData({}); // Auto-refresh to fetch updated data from the backend
    } catch (err) {
      console.error('Error updating property status:', err);
      setError('Failed to update property status.');
    }
  }

  return {
    properties,
    loading,
    error,
    fetchData,
    updateStatus,
  }
}

