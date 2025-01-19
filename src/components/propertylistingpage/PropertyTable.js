import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CheckCircle} from 'lucide-react';
import { fetchStatusOptions } from '../../services/newapiServices';


export function PropertyTable({ properties, onStatusChange }) {
  const [statusOptions, setStatusOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [updateError, setUpdateError] = useState(null);
  console.log("Property show",properties)
 

  useEffect(() => {
    const loadStatusOptions = async () => {
      try {
        const options = await fetchStatusOptions(); // Call the service function
        setStatusOptions(options.result);
      } catch (error) {
        console.error('Error fetching status options:', error);
      }
    };

    loadStatusOptions(); // Fetch status options on mount
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusSelect = (propertyId, status) => {
    setSelectedStatus(prev => ({
      ...prev,
      [propertyId]: status
    }));
  };

  const handleStatusUpdate = async (propertyId) => {
    const newStatus = selectedStatus[propertyId];
    if (newStatus && newStatus !== properties.find(p => p.id === propertyId)?.current_status) {
      try {
        setUpdateError(null);
        await onStatusChange(propertyId, newStatus);
        setSelectedStatus(prev => ({
          ...prev,
          [propertyId]: undefined
        }));
      } catch (error) {
        console.error('Failed to update status:', error);
        setUpdateError(`Failed to update status: ${error.message}`);
      }
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border">
      {updateError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {updateError}</span>
        </div>
      )}
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500">PROPERTY ID</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500">PROPERTY NAME</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500">CITY</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500">PRICE</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500">STATUS</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {properties.map((property) => (
            <tr key={property.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-500">{property.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{property.community_name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{property.city_name}</td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {property.rental_high ? property.rental_high.toLocaleString() : 'N/A'} INR
              </td>
              <td className="px-6 py-4">
                <select
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(property.current_status)}`}
                  value={property.current_status}
                  onChange={(e) => handleStatusSelect(property.id, e.target.value)}
                >
                  <option value={property.id}>
                    {property.current_status}
                  </option>
                  {statusOptions.map((status) => (
                    <option key={status.status_code} value={status.id}>
                      {status.status_code}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleStatusUpdate(property.id)}
                  className={`p-1 rounded-full transition-colors ${
                    selectedStatus[property.id] && selectedStatus[property.id] !== property.current_status
                      ? 'hover:bg-green-50 text-green-600'
                      : 'text-gray-400'
                  }`}
                  disabled={!selectedStatus[property.id] || selectedStatus[property.id] === property.current_status}
                  title="Update status"
                >
                  <CheckCircle className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

PropertyTable.propTypes = {
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      community_name: PropTypes.string,
      city_name: PropTypes.string,
      rental_high: PropTypes.number,
      current_status: PropTypes.string,
    })
  ).isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

