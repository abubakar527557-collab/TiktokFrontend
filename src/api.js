import axios from 'axios';

console.log("Environment:", process.env);

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
console.log("Using API URL:", API_URL);

// Request interceptor
axios.interceptors.request.use(request => {
  console.log('Starting Request', request.url);
  return request;
});

// Authentication
export const register = async (username, password, role) => {
  return await axios.post(`${API_URL}/register`, { username, password, role });
};

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    
    if (response.data.message === 'Invalid credentials') {
      throw new Error('Invalid credentials');
    }
    
    if (!response.data.success || !response.data.token) {
      throw new Error('Invalid server response');
    }
    
    const role = response.data.role || (response.data.user && response.data.user.role);
    if (!role) {
      throw new Error('Role not received');
    }
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('role', role);
    
    return {
      token: response.data.token,
      role: role,
      user: response.data.user
    };
    
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Media Functions
// export const uploadMedia = async (formData) => {
//   const token = localStorage.getItem('token');
//   const response = await axios.post(`${API_URL}/media`, formData, {
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'multipart/form-data'
//     },
//     timeout: 30000
//   });
//   return response;
// };
export const uploadMedia = async (formData) => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.post(
      `${API_URL}/media`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      }
    );

    // Always check if response exists
    if (response && response.data) {
      return response.data;  // Return only the data part
    } else {
      throw new Error("No response data received from server");
    }
  } catch (error) {
    console.error("Upload failed:", error);

    // Axios errors have `response`, `request`, or `message`
    if (error.response) {
      // Server responded with error (4xx or 5xx)
      throw new Error(
        error.response.data?.message || "Server error during upload"
      );
    } else if (error.request) {
      // No response from server
      throw new Error("No response from server");
    } else {
      // Something else went wrong
      throw new Error(error.message || "Unknown upload error");
    }
  }
};

export const getLatestVideos = async () => {
  try {
    const response = await axios.get(`${API_URL}/media/latest`, {
      params: {
        limit: 12, // Get 12 latest videos
        sort: '-createdAt' // Sort by newest first
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching latest videos:', error);
    throw error;
  }
};

// export const getMedia = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/media`);
//     return response;
//   } catch (error) {
//     console.error("Error fetching media:", error);
//     throw error;
//   }
// };

export const getMedia = async () => {
  try {
    const response = await axios.get(`${API_URL}/media`, {
      timeout: 15000 // 15 second timeout
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching media:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to fetch media'
    );
  }
};

export const searchVideos = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/media/search`, {
      params: { q: query }
    });
    return response;
  } catch (error) {
    console.error("Error searching videos:", error);
    throw error;
  }
};

// Comments
export const getComments = async (mediaId) => {
  try {
    const response = await axios.get(`${API_URL}/media/${mediaId}/comments`, {
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const postComment = async (mediaId, text) => {
  const token = localStorage.getItem('token');
  console.log("Using token:", token); // 👈 check if null or real JWT
  const response = await axios.post(
    `${API_URL}/media/${mediaId}/comments`,
    { text },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  console.log("Backend returned comment:", response.data); // 👈 add this
  return response.data;
};


// Ratings
export const addRating = async (mediaId, value) => {
  const token = localStorage.getItem('token');
  return await axios.post(`${API_URL}/media/${mediaId}/ratings`, 
    { value },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
};

// Response interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      return Promise.reject(error.response.data);
    } else if (error.request) {
      return Promise.reject({ message: 'No response from server' });
    } else {
      return Promise.reject({ message: error.message });
    }
  }
);