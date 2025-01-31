import { getRecords ,fetchPropertiesApi,updatePropertyStatusApi, updateUserRecordApi} from "../config/apiRoute";

export const fetchCities = async () => {
  return await getRecords("st_city", "id,name", "rstatus=1");
};

export const fetchStatusOptions = async () => {
  return await getRecords("st_current_status", "id,status_code", 'status_category="ADM"');
};

export const fetchCommunities = async (cityName) => {
  if (cityName === "All City") {
    return { result: [] }; 
  }
  return await getRecords("st_community", "id,name", `rstatus=1`);
};

export const fetchProperties = async (filters) => {
  try {
      const data = await fetchPropertiesApi(filters);

      if (!data || !data.results || !data.pagination) {
          throw new Error("Invalid response structure from API");
      }

      console.log("API Response:", data);  

      return { 
          results: data.results,  
          pagination: data.pagination  
      };

  } catch (error) {
      console.error("Error fetching properties:", error);
      return { error: error.message };
  }
};

  export const updatePropertyStatus = async (propertyId, newStatus) => {
    try {
      const response = await updatePropertyStatusApi(propertyId, newStatus);
      return { success: true, data: response };
    } catch (error) {
      console.error("Error updating property status:", error);
      return { error: error.message };
    }
  };

  // Fetch users and roles
export const fetchUsersAndRoles = async () => {
  try {
    const users = await getRecords('dy_user', 'id,user_name,role_id,rstatus');
    const roles = await getRecords('st_role', 'id,role');
    return { users: users.result, roles: roles.result };
  } catch (error) {
    console.error('Error fetching users and roles:', error);
    return { error: error.message };
  }
};

// Update user record (role and rstatus)
export const updateUserRecord = async (userId, roleId, rstatus) => {
  try {
    const response = await updateUserRecordApi(userId, roleId, rstatus);
    return { success: true, data: response };
  } catch (error) {
    console.error('Error updating user record:', error);
    return { error: error.message };
  }
};


 