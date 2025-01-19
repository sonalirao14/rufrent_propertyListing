import { useState, useEffect } from 'react'
import { FilterBar } from './FilterBar'
import { PropertyTable } from './PropertyTable'
import { PropertyData } from './relatedData/PropertyData'
import { Header } from './Header';
import {SideBar}  from './SideBar'

export function AdminPanel() {
  const { properties, loading, error, fetchData, updateStatus } = PropertyData()
  const [filters, setFilters] = useState({
    searchQuery: '',
    status: 'All Status',
    city: 'All City',
    community: 'All Community',
  })

 

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    console.log("New Filters",filters)
    console.log("New Filters",newFilters)
    fetchData(newFilters)
  }
  useEffect(() => {
    fetchData(filters)
  }, [])

  const handleStatusChange = async (propertyId, newStatus) => {
    await updateStatus(propertyId, newStatus)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
    <SideBar />
    <div className="flex-1 ml-64">
     <Header/>
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
              />
            )}
          </div>
        </div>
      </main>
    </div>
  </div>
  )
}

