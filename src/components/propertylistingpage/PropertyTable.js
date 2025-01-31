import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { Eye } from "lucide-react"
import { fetchStatusOptions } from "../../services/newapiServices"
import { FaTrash } from "react-icons/fa"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import Image1 from "../staticImages/pexels-binyaminmellish-106399.jpg"
import Image2 from "../staticImages/pexels-julia-kuzenkov-442028-1974596.jpg"

// Import CSS files for Swiper
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export function PropertyTable({ properties, onStatusChange, fetchData, currentPage, totalPages, onPageChange }) {
  const [statusOptions, setStatusOptions] = useState([])
  const [selectedStatus, setSelectedStatus] = useState({})
  const [updateError, setUpdateError] = useState(null)
  const [modalData, setModalData] = useState(null)
  const [dummyImages, setDummyImages] = useState([Image1, Image2])

  useEffect(() => {
    const loadStatusOptions = async () => {
      try {
        const options = await fetchStatusOptions()
        setStatusOptions(options.result)
      } catch (error) {
        console.error("Error fetching status options:", error)
      }
    }

    loadStatusOptions()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
    console.log("Current Page:", currentPage);
    console.log("Total Pages:", totalPages);
 
  
  const handlePageChange = (newPage) => {
    console.log("Changing to page:", newPage);  

    if (newPage > 0 && newPage <= totalPages) {
        // fetchData({ page: newPage });  
        onPageChange(newPage)
    }
};


  
  const handleDelete = (indexToDelete) => {
    setDummyImages((prevImages) => prevImages.filter((_, index) => index !== indexToDelete))
  }

  const handleStatusSelect = (propertyId, status) => {
    setSelectedStatus((prev) => ({
      ...prev,
      [propertyId]: status,
    }))
  }

  const handleStatusUpdate = async (propertyId) => {
    const newStatus = selectedStatus[propertyId]
    if (newStatus && newStatus !== properties.find((p) => p.id === propertyId)?.current_status) {
      try {
        setUpdateError(null)
        await onStatusChange(propertyId, newStatus)
        setSelectedStatus((prev) => ({
          ...prev,
          [propertyId]: undefined,
        }))
        if (modalData) {
          closeModal()
        }
      } catch (error) {
        console.error("Failed to update status:", error)
        setUpdateError(`Failed to update status: ${error.message}`)
      }
    }
  }

  const openModal = (property) => {
    setModalData(property)
  }

  const closeModal = () => {
    setSelectedStatus((prev) => ({
      ...prev,
      [modalData.id]: undefined,
    }))
    setModalData(null)
  }

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
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500">CURRENT STATUS</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500">VIEW DETAILS</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {properties.map((property) => (
            <tr key={property.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-500">{property.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{property.community_name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{property.city_name}</td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {property.rental_high ? property.rental_high.toLocaleString() : "N/A"} INR
              </td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(property.current_status)}`}>
                  {property.current_status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => openModal(property)}
                  className="p-1 rounded-full hover:bg-blue-50 text-blue-600"
                  title="View Details"
                >
                  <Eye className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="mb-4">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="h-64 rounded-lg"
              >
                {dummyImages.map((image, index) => (
                  <SwiperSlide key={index} className="relative flex items-center justify-center">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Static Image ${index + 1}`}
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                    <FaTrash
                      onClick={() => handleDelete(index)}
                      className="absolute top-2 right-2 text-red-600 bg-white p-2 rounded-full cursor-pointer hover:text-red-800 hover:shadow-lg"
                      size={34}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              {dummyImages.length === 0 && (
                <p className="text-center text-gray-500 mt-4">No images available in the carousel.</p>
              )}
            </div>

            <h2 className="text-xl font-bold mb-4 text-center">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <p>
                <strong>ID:</strong> {modalData.id}
              </p>
              <p>
                <strong>Name:</strong> {modalData.community_name}
              </p>
              <p>
                <strong>Address:</strong> {modalData.address}
              </p>
              <p>
                <strong>Price:</strong> {modalData.rental_high} INR
              </p>
              <p>
                <strong>Property Type:</strong> {modalData.prop_type}
              </p>
              <p>
                <strong>Home Type:</strong> {modalData.home_type}
              </p>
              <p>
                <strong>Property Description:</strong> {modalData.prop_desc}
              </p>
              <p>
                <strong>Community Name:</strong> {modalData.community_name}
              </p>
              <p>
                <strong>Pincode:</strong> {modalData.pincode}
              </p>
              <p>
                <strong>Current Status:</strong> {modalData.current_status}
              </p>
              <p>
                <strong>Total Area:</strong> {modalData.total_area} acres
              </p>
              <p>
                <strong>Open Area:</strong> {modalData.open_area}%
              </p>
              <p>
                <strong>Number of Blocks:</strong> {modalData.nblocks}
              </p>
              <p>
                <strong>Floors per Block:</strong> {modalData.nfloors_per_block}
              </p>
              <p>
                <strong>Houses per Floor:</strong> {modalData.nhouses_per_floor}
              </p>
              <p>
                <strong>Total Flats:</strong> {modalData.totflats}
              </p>
              <p>
                <strong>Number of Bedrooms:</strong> {modalData.nbeds}
              </p>
              <p>
                <strong>Number of Bathrooms:</strong> {modalData.nbaths}
              </p>
              <p>
                <strong>Number of Balconies:</strong> {modalData.nbalcony}
              </p>
              <p>
                <strong>Eating Preference:</strong> {modalData.eat_pref}
              </p>
              <p>
                <strong>Parking Count:</strong> {modalData.parking_count}
              </p>
              <p>
                <strong>Deposit:</strong> {modalData.deposit} month(s)
              </p>
              <p>
                <strong>Maintenance Type:</strong> {modalData.maintenance_type}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Current Status</h3>
              <div className="flex items-center space-x-4">
                <select
                  className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(selectedStatus[modalData.id] || modalData.current_status)}`}
                  value={selectedStatus[modalData.id] || modalData.current_status}
                  onChange={(e) => handleStatusSelect(modalData.id, e.target.value)}
                >
                  <option value={modalData.current_status}>{modalData.current_status}</option>
                  {statusOptions.map((status) => (
                    <option key={status.status_code} value={status.id}>
                      {status.status_code}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleStatusUpdate(modalData.id)}
                  className={`px-4 py-2 rounded transition-colors ${
                    selectedStatus[modalData.id] && selectedStatus[modalData.id] !== modalData.current_status
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-300 text-gray-500"
                  }`}
                  disabled={!selectedStatus[modalData.id] || selectedStatus[modalData.id] === modalData.current_status}
                >
                  Update Status
                </button>
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
        {/* Pagination Controls */}
        <div className="flex justify-between p-4">
    <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
    >
        Previous
    </button>
    {/* Page Number Buttons */}
    <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-2 rounded ${
                pageNum === currentPage
                  ? "bg-blue-700 text-white font-bold"  
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
    <span className="text-sm font-semibold">Page {currentPage} of {totalPages}</span>

    <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
    >
        Next
    </button>
</div>

    </div>
  )
}

PropertyTable.propTypes = {
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      community_name: PropTypes.string,
      city_name: PropTypes.string,
      rental_high: PropTypes.number,
      current_status: PropTypes.string,
    }),
  ).isRequired,
  onStatusChange: PropTypes.func.isRequired,
}

export default PropertyTable
