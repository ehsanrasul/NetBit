import axios from "axios";

const getRequest = async (url, customHeaders = {}) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "identity",
        ...customHeaders, // Allow custom headers to be passed
      },
    });

    return response.data;
  } catch (error) {
    // Handle errors more explicitly if needed
    console.error("Error in HTTP GET request:", error.message);
    throw error; // Re-throw the error for the caller to handle if necessary
  }
};

export default {
  get: getRequest,
};
