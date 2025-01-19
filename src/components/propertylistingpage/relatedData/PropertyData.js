import { useState } from 'react'
import { fetchProperties,updatePropertyStatus } from '../../../services/newapiServices';

export function PropertyData() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // const fetchProperties = async (filters) => {
  //   try {
  //     setLoading(true);
  //     console.log('Filters being sent:', filters);
  
  //     // Build where conditions
  //     let whereConditions = [];
  //     if (filters.status && filters.status !== 'All Status') {
  //       whereConditions.push(`current_status=${filters.status}`);
  //     }
  //     if (filters.city && filters.city !== 'All City') {
  //       whereConditions.push(`city_name='${filters.city}'`);
  //     }
  //     if (filters.community && filters.community !== 'All Community') {
  //       whereConditions.push(`community=${filters.community}`);
  //     }
  //     if (filters.searchQuery) {
  //       whereConditions.push(
  //         `(community_name LIKE '%${filters.searchQuery}%' OR city_name LIKE '%${filters.searchQuery}%')`
  //       );
  //     }
  
  //     const whereClause = whereConditions.length > 0 ? whereConditions.join('&') : '';

       
  //     // Build query parameters safely
  //     const queryParams = new URLSearchParams({
  //       tableName: 'dy_property',
  //       fieldNames: 'id,prop_type_id,community_name,city_name,rental_high,current_status',
  //     });
  
  //     if (whereClause) {
  //       queryParams.append('whereCondition', whereClause);
  //     }
  
  //     const apiUrl = `/api/showPropDetails?${whereClause}`;
  
  //     console.log('Calling API:', apiUrl);
  
  //     const response = await fetch(apiUrl);
  
  //     // Check for HTTP errors
  //     if (!response.ok) {
  //       throw new Error(`API call failed with status ${response.status}: ${response.statusText}`);
  //     }
  
  //     const data = await response.json();
  //     console.log(data,"data")
  //     // Validate the response structure
  //     if (!data || !data.results) {
  //       throw new Error('Invalid response structure from API');
  //     }
  
  //     setProperties(data.results);
      
  //     // onFetchComplete?.(data.results); // Notify parent component if callback is provided
  //   } catch (err) {
  //     console.error("No Properties found");
  //     // setError(`Failed to fetch data: Listings not found`);
  //     alert("No Listing Found")
  //     // await fetchProperties({
  //     //   searchQuery: '',
  //     //   status: 'All Status',
  //     //   city: 'All City',
  //     //   community: 'All Community',
  //     // })
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
 
  // const updatePropertyStatus = async (propertyId, newStatus) => {
  //   try {
  //     const response = await fetch('/api/updateRecord', {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         tableName: 'dy_property',
  //         fieldValuePairs: { current_status: newStatus },
  //         whereCondition: `id=${propertyId}`,
  //       }),
  //     })

  //     if (!response.ok) {
  //       const errorData = await response.json().catch(() => null)
  //       throw new Error(`Failed to update status: ${response.status}. ${errorData?.message || ''}`)
  //     }

  //     await response.json()
  //     // After successful update, fetch fresh data
  //     await fetchProperties({
  //       searchQuery: '',
  //       status: 'All Status',
  //       city: 'All City',
  //       community: 'All Community',
  //     })
  //   } catch (err) {
  //     console.error('Error updating property status:', err)
  //     setError(err.message)
  //     throw err
  //   }

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
    // fetchProperties,
    // updatePropertyStatus,
    fetchData,
    updateStatus,
  }
}

