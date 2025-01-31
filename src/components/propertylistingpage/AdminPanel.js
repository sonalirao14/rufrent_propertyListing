import { useState, useEffect } from 'react'
import { FilterBar } from './FilterBar'
import { PropertyTable } from './PropertyTable'
import { PropertyData } from './relatedData/PropertyData'
import { Header } from './Header';
import { SideBar } from './SideBar'

export function AdminPanel() {
  const { properties, loading, error, fetchData, updateStatus, currentPage, totalPages, setCurrentPage } = PropertyData(); 

  const [filters, setFilters] = useState({
    searchQuery: '',
    status: 'All Status',
    city: 'All City',
    community: 'All Community',
  });

  useEffect(() => {
    fetchData({ ...filters, page: currentPage });  
  }, [currentPage, filters]);  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);  
    fetchData({ ...newFilters, page: 1 });
  };

  const handleStatusChange = async (propertyId, newStatus) => {
    await updateStatus(propertyId, newStatus);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);  
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <FilterBar onFilterChange={handleFilterChange} />
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <strong className="font-bold">Error!</strong>
                  <span className="block sm:inline"> {error}</span>
                </div>
              )}
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 w-full bg-gray-200 animate-pulse rounded"></div>
                  ))}
                </div>
              ) : (
                <PropertyTable 
                  properties={properties} 
                  onStatusChange={handleStatusChange} 
                  fetchData={fetchData} 
                  currentPage={currentPage} 
                  totalPages={totalPages}
                  onPageChange={handlePageChange} 
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
