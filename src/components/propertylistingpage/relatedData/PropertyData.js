import { useState, useEffect } from "react";
import { fetchProperties, updatePropertyStatus } from "../../../services/newapiServices";

export function PropertyData() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (filters = {}) => {
    try {
        setLoading(true);
        setError(null);

        const pageToFetch = filters.page || currentPage;  // ✅ Ensure correct page is used

        const response = await fetchProperties({ 
            page: pageToFetch,   // ✅ Pass correct page number
            limit: 6,  
            status: filters.status || "All Status",
            city: filters.city || "All City",
            community: filters.community || "All Community"
        });

        if (response) {
            setProperties(response.results || []);
            setCurrentPage(response.pagination?.currentPage || pageToFetch);  // ✅ Update currentPage
            setTotalPages(response.pagination?.totalPages || 1);
        }
    } catch (err) {
        console.error("Error fetching properties:", err);
        setProperties([]);
        setError("Failed to fetch properties.");
    } finally {
        setLoading(false);
    }
};


// Fetch data whenever `currentPage` changes
useEffect(() => {
  fetchData({ page: currentPage });
}, [currentPage]); 

  const updateStatus = async (propertyId, newStatusCode) => {
    try {
      await updatePropertyStatus(propertyId, newStatusCode);
      fetchData({ page: currentPage });
    } catch (err) {
      console.error("Error updating property status:", err);
      setError("Failed to update property status.");
    }
  };

  return {
    properties,
    loading,
    error,
    currentPage,
    totalPages,
    fetchData,
    setCurrentPage,  
    updateStatus,
  };
}
