import { getRecords ,fetchPropertiesApi,updatePropertyStatusApi} from "../config/apiRoute";

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
      if (!data || !data.results) {
        throw new Error("Invalid response structure from API");
      }
      return { results: data.results };
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

 