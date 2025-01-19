// Importing the axios library to handle HTTP requests
import axios from "axios";

export const apiUrl = "http://localhost:5000/api";

/**
 * Fetch records from the database using query parameters.
 *
 * @param {string} tableName - Name of the database table.
 * @param {string} fieldNames - Comma-separated field names to retrieve.
 * @param {string} [whereCondition] - Optional filtering condition (SQL-like).
 * @returns {Promise<Object>} - API response data.
 */
export const getRecords = async (tableName, fieldNames, whereCondition = "") => {
  try {
    // Validate required parameters
    if (!tableName || !fieldNames) {
      throw new Error("Missing required parameters: tableName or fieldNames.");
    }

    // Construct query parameters
    const params = {
      tableName, // Use exact parameter name from the backend
      fieldNames,
      whereCondition,
    };

    console.log("Sending GET request with params:", params); // Debugging

    // Make the GET request to the API
    const response = await axios.get(`${apiUrl}/getRecords`, { params });

    // Return the response data
    return response.data;
  } catch (error) {
    console.error("Error fetching records:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch properties based on filters
export const fetchPropertiesApi = async (filters) => {
  const whereConditions = [];
  if (filters.status && filters.status !== "All Status") {
    whereConditions.push(`current_status=${filters.status}`);
  }
  if (filters.city && filters.city !== "All City") {
    whereConditions.push(`city_name='${filters.city}'`);
  }
  if (filters.community && filters.community !== "All Community") {
    whereConditions.push(`community=${filters.community}`);
  }
  if (filters.searchQuery) {
    whereConditions.push(
      `(community_name LIKE '%${filters.searchQuery}%' OR city_name LIKE '%${filters.searchQuery}%')`
    );
  }

  const whereClause = whereConditions.length > 0 ? whereConditions.join("&") : "";
  const url = `${apiUrl}/showPropDetails?${whereClause}`;
  
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};

// Update property status
export const updatePropertyStatusApi = async (propertyId, newStatus) => {
  const url = `${apiUrl}/updateRecord`;
  const payload = {
    tableName: "dy_property",
    fieldValuePairs: { current_status: newStatus },
    whereCondition: `id=${propertyId}`,
  };

  try {
    const response = await axios.put(url, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating property status:", error);
    throw error;
  }
};

// /**
//  * Fetch status options from the database.
//  *
//  * @returns {Promise<Array>} - List of status options with `id` and `status_code`.
//  */
// export const fetchStatusOptionsApi = async () => {
//   try {
//     // Define query parameters for fetching status options
//     const params = {
//       tableName: "st_current_status", // Table name in the database
//       fieldNames: "id,status_code",   // Fields to retrieve
//       whereCondition: 'status_category="ADM"', // Filtering condition
//     };

//     console.log("Sending GET request for status options with params:", params); // Debugging

//     // Make the GET request to the API
//     const response = await axios.get(`${apiUrl}/getRecords`, { params });

//     // Extract and return the `result` field from the response
//     return response.data.result || [];
//   } catch (error) {
//     console.error("Error fetching status options:", error.response?.data || error.message);
//     throw error;
//   }
// };

// Function to add a new record to the database table
// export const addNewRecord = async (tableName, fieldNames, fieldValues) => {
//   //postproperties
//   try {
//     // Sending a POST request to the server with the data (table name, field names, and values)
//     const response = await axios.post(`${apiUrl}/addNewRecord`, {
//       tableName, // The name of the table where the record is to be added
//       fieldNames, // The names of the fields to be inserted
//       fieldValues, // The values for each field in the record
//     });
//     // Returning the response data from the server
//     return response.data;
//   } catch (error) {
//     // Logging any errors encountered during the process
//     console.error("Error adding new record:", error);
//     // Throwing the error to be handled by the calling function
//     throw error;
//   }
// };



// export const deleteRecord = async (tableName, whereCondition = "") => {
//   try {
//     if (!tableName) {
//       throw new Error("Table name is required.");
//     }
//     const api = `${apiUrl}/deleteRecords`;
//     const response = await axios.delete(api, {
//       params: {
//         tbl_name: tableName,
//         where_condition: whereCondition,
//       },
//     });
//     console.log("Delete response:", response);
//     return response.data;
//   } catch (error) {
//     console.error("Error deleting records:", error.message || error);
//     throw new Error(error.response?.data?.message || "Failed to delete records");
//   }
// };





// // Function to add a request to the system
// //addRmTask
// export const addRequest = async (requestData) => {
//   // rmrequests property id, userid
//   try {
//     // Sending a POST request with the request data to add the request
//     const response = await axios.post(`${apiUrl}/addRequest`, requestData);
//     // Returning the response data from the server
//     return response.data;
//   } catch (error) {
//     // Logging any errors encountered during the process
//     console.error("Error adding request:", error);
//     // Throwing the error to be handled by the calling function
//     throw error;
//   }
// };

// // Function to fetch all properties from the server

// // export const displayAllProperties = async () => {
// //   try {
// //     // Sending a GET request with pagination parameters to fetch properties
// //     const url = `${apiUrl}/getAllProperties`;

// //     // Sending a GET request
// //     const response = await axios.get(url);

// //     console.log("API URL:", url); // Debugging URL
// //     console.log("API Response:", response.data); // Debugging Response

// //     // Returning success status and data
// //     return {
// //       status: apiStatusConstants.success, // Indicating success
// //       data: response.data,
// //       errorMsg: null,
// //     };
// //   } catch (error) {
// //     // Logging the error
// //     console.error("Error fetching properties:", error);

// //     // Returning failure status and error message
// //     return {
// //       status: apiStatusConstants.failure, // Indicating failure
// //       data: null,
// //       errorMsg: error.response?.data?.message || "Fetch Failed",
// //     };
// //   }
// // };


// //displayProperties
// export const displayAllProperties = async (filters = {}, pagination = { page: 1, limit: 5 }) => {
//   try {
//     const { page, limit } = pagination;

//     // Build query parameters
//     const params = {
//       ...filters, // Add filter parameters (e.g., property_id, city, builders, etc.)
//       page, // Pagination page
//       limit, // Pagination limit
//     };

//     const url = `${apiUrl}/getAllProperties`;

//     console.log("Request Params:", params); // Debugging Params

//     // Sending a GET request with query parameters
//     const response = await axios.get(url, { params });

//     console.log("API Response:", response.data); // Debugging Response

//     // Returning success status and data
//     return {
//       status: apiStatusConstants.success,
//       data: response.data.results, // Assuming results are in the "results" field
//       pagination: response.data.pagination, // Extract pagination details from the response
//       errorMsg: null,
//     };
//   } catch (error) {
//     // Logging the error
//     console.error("Error fetching properties:", error);

//     // Returning failure status and error message
//     return {
//       status: apiStatusConstants.failure,
//       data: null,
//       errorMsg: error.response?.data?.message || "Fetch Failed",
//     };
//   }
// };


// // Fetch all properties with enhanced data
// // export const displayAllProperties = async ({
// //   page = 1,
// //   limit = 5,
// //   propertyId = null,
// //   city = null,
// //   builders = null,
// //   community = null,
// //   hometype = null,
// //   propertydescription = null,
// // }) => {
// //   try {
// //     // Construct the API URL with filters and pagination
// //     let url = `${apiUrl}/getAllProperties?page=${page}&limit=${limit}`;
// //     if (propertyId) url += `&property_id=${propertyId}`;
// //     if (city) url += `&city=${encodeURIComponent(city)}`;
// //     if (builders) url += `&builders=${builders}`;
// //     if (community) url += `&community=${encodeURIComponent(community)}`;
// //     if (hometype) url += `&hometype=${hometype}`;
// //     if (propertydescription)
// //       url += `&propertydescription=${propertydescription}`;

// //     // Sending a GET request with the constructed URL
// //     const response = await axios.get(url);

// //     console.log("API URL:", url); // Debugging URL
// //     console.log("API Response:", response.data); // Debugging Response

// //     // Returning success status and data
// //     return {
// //       status: apiStatusConstants.success, // Indicating success
// //       data: response.data.results, // Extracting results array
// //       pagination: response.data.pagination, // Extracting pagination info
// //       errorMsg: null,
// //     };
// //   } catch (error) {
// //     // Logging the error
// //     console.error("Error fetching properties:", error);

// //     // Returning failure status and error message
// //     return {
// //       status: apiStatusConstants.failure, // Indicating failure
// //       data: null,
// //       errorMsg: error.response?.data?.error || "Fetch Failed",
// //     };
// //   }
// // };



// export const fetchFilteredProperties = async (filters) => {
//   try {
//     // Construct the API URL dynamically based on filters
//     let url = `${apiUrl}/filterProperties`;
//     const queryParams = new URLSearchParams(filters).toString();
//     if (queryParams) {
//       url += `?${queryParams}`;
//     }

//     console.log("API URL for Filtered Properties:", url); // Debugging URL

//     // Sending a GET request to fetch filtered properties
//     const response = await axios.get(url);

//     console.log("Filtered Properties Response:", response.data); // Debugging Response

//     // Returning success status and data
//     return {
//       status: apiStatusConstants.success,
//       data: response.data.results, // Extracting results from the response
//       errorMsg: null,
//     };
//   } catch (error) {
//     console.error("Error fetching filtered properties:", error);

//     // Returning failure status and error message
//     return {
//       status: apiStatusConstants.failure,
//       data: null,
//       errorMsg: error.response?.data?.error || "Fetch Failed",
//     };
//   }
// };



// //showPropDetails
// export const displayProperties = async (propertyId) => {
//   try {
//     // Sending a GET request with pagination parameters to fetch properties
//     const url =`${apiUrl}/getAllProperties?property_id=${propertyId}`
    
//     // Sending a GET request
//     const response = await axios.get(url);

//     console.log("API URL:", url); // Debugging URL
//     console.log("API Response:", response.data); // Debugging Response

//     // Returning success status and data
//     return {
//       status: apiStatusConstants.success, // Indicating success
//       data: response.data,
//       errorMsg: null,
//     };
//   } catch (error) {
//     // Logging the error
//     console.error("Error fetching properties:", error);

//     // Returning failure status and error message
//     return {
//       status: apiStatusConstants.failure, // Indicating failure
//       data: null,
//       errorMsg: error.response?.data?.message || "Fetch Failed",
//     };
//   }
// };

// export const fetchUserActions = async (params = {}) => {
//   try {
//     console.log("Calling API with params:", params);

//     // Make an API request using axios, passing query parameters dynamically
//     const response = await axios.get(`${apiUrl}/actions`, {
//       params, // Automatically attaches query parameters (e.g., { id: 1, user_id: 2 } -> ?id=1&user_id=2)
//     });

//     // Check if the response status is 200 and has data
//     if (response.status === 200 && response.data) {
//       console.log("API response data:", response.data);

//       // Return the structured data from the API response
//       return {
//         message: response.data.message,
//         actions: response.data.results,
//       };
//     } else {
//       // Handle unexpected response formats
//       throw new Error("Unexpected API response format.");
//     }
//   } catch (error) {
//     // Log the error for debugging purposes
//     console.error("Error fetching user actions:", error);

//     // Extract a user-friendly error message from the error response or fallback
//     const errorMsg =
//       error.response?.data?.error ||
//       error.message ||
//       "Failed to fetch user actions.";

//     // Throw the error with the extracted message for higher-level handling
//     throw new Error(errorMsg);
//   }
// };


// // Function to fetch all transactions based on the user ID
// //getTasks
// export const getAllTransactionBasedOnId = async (rmId) => {
//   try {
//     // Sending a GET request with the RM ID as a parameter to fetch request details
//     const response = await axios.get(`${apiUrl}/requests`, {
//       params: { rm_id: rmId }, // Passing the RM ID as a query parameter
//     });

//     // Returning the entire response data
//     return response.data;
//   } catch (error) {
//     // Logging any errors encountered during the process
//     console.error("Error fetching request details:", error);
//     // Throwing the error to be handled by the calling function
//     throw error;
//   }
// };

// // Function to fetch a list of Field Managers (FM) based on a community ID
// //getFmList
// export const listOfFmBasedOnCommunityId = async (communityId) => {
//   try {
//     // Sending a GET request with the community ID as a parameter to fetch FM list for the community
//     const response = await axios.get(`${apiUrl}/FmList`, {
//       params: { communityId }, // Passing the community ID as a query parameter
//     });
//     // Returning the response data (the list of Field Managers)
//     return response.data;
//   } catch (error) {
//     // Logging any errors encountered during the process
//     console.error("Error fetching FM list:", error);
//     // Throwing the error to be handled by the calling function
//     throw error;
//   }
// };

// Function to fetch all records from the database
// Function to fetch records from different tables dynamically
// export const getRecords = async (tableName, fieldNames, additionalParams = {}) => {
//   try {
//     // Format the where_condition
//     const whereCondition = Object.keys(additionalParams)
//       .map((key) => {
//         const value = additionalParams[key];
//         // Add quotes for string values
//         return typeof value === "string" ? `${key}="${value}"` : `${key}=${value}`;
//       })
//       .join(" AND ");

//     // Log the constructed where_condition for debugging
//     console.log("Constructed where_condition:", whereCondition);

//     const response = await axios.get(`${apiUrl}/getRecords`, {
//       params: {
//         tbl_name: tableName,
//         field_names: fieldNames,
//         where_condition: whereCondition || null, // Add constructed condition
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Error fetching records:", error);
//     throw error;
//   }
// };


// Function to update the status of a transaction
//updateTask
// export const updateTransaction = async (transactionId, status) => {
//   try {
//     // Sending a PUT request to update the status of a transaction
//     const response = await axios.put(`${apiUrl}/updatetranscationsstatus`, {
//       transactionId, // The ID of the transaction being updated
//       status, // The new status for the transaction
//     });
//     // Returning the response data (the updated transaction details)
//     return response.data;
//   } catch (error) {
//     // Logging any errors encountered during the process
//     console.error("Error updating transaction:", error);
//     // Throwing the error to be handled by the calling function
//     throw error;
//   }
// };
