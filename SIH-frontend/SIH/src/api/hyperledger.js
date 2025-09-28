import axios from 'axios';
import { auth } from '../../firebaseConfig'; // Import Firebase auth instance

// IMPORTANT: Replace this with the actual IP address of the computer running your backend server.
// Find it by running `ipconfig` (Windows) or `ifconfig` (macOS/Linux) in your system's terminal (not WSL).
const API_URL = 'http://172.17.179.177:3000/api';
 // <--- CHANGE THIS IP ADDRESS

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000, // Increased timeout for potentially slow blockchain operations
});

// This interceptor automatically attaches the user's Firebase token to every API request.
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      // Force refresh the token to ensure it's not expired
      const token = await user.getIdToken(true);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- PRODUCE & BATCH APIS ---

/**
 * Creates a new produce batch on the blockchain.
 * The backend will extract the farmer's UID from the verified token.
 * @param {object} batchData - { cropType, quantity, unit, farmerName, farmLocation }
 * @returns {Promise<object>}
 */
export const createProduceBatch = async (batchData) => {
    try {
        // Aligned with backend server.js route: router.post('/produce/create', ...)
        const response = await api.post('/produce', batchData);
        return response.data;
    } catch (error) {
        console.error('API Error: createProduceBatch', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to create batch');
    }
};

/**
 * Fetches the complete history of a specific batch.
 * @param {string} batchId - The ID of the batch to fetch.
 * @returns {Promise<Array<object>>} - An array of transaction history items.
 */
export const getBatchHistory = async (batchId) => {
    try {
        // Aligned with backend server.js route: router.get('/produce/:id', ...)
        const response = await api.get(`/produce/${batchId}`);
        return response.data;
    } catch (error) {
        console.error('API Error: getBatchHistory', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch batch history');
    }
};

/**
 * Updates the state of a batch (e.g., Aggregator receives, Transporter ships).
 * @param {string} batchId - The ID of the batch to update.
 * @param {object} updateData - { newStatus }
 * @returns {Promise<object>}
 */
export const updateBatchStatus = async (batchId, newStatus, newOwnerUID) => {
    try {
        // Aligned with backend server.js route: router.put('/produce/update', ...)
        const response = await api.put(`/produce/update`, { id: batchId, newStatus, newOwnerUID });
        return response.data;
    } catch (error) {
        console.error('API Error: updateBatchStatus', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to update batch');
    }
};

/**
 * Fetches all batches created by the currently logged-in farmer.
 * The backend identifies the farmer via their Firebase UID in the auth token.
 * @returns {Promise<Array<object>>} - An array of the farmer's assets.
 */
export const getMyBatches = async () => {
  try {
    const response = await api.get('/produce/my-batches');

    // Normalize: if backend returns { success, count, assets } return assets
    if (response.data) {
      if (Array.isArray(response.data.assets)) return response.data.assets;
      if (Array.isArray(response.data)) return response.data;
    }

    // fallback empty array
    return [];
  } catch (error) {
    console.error('API Error: getMyBatches', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch my batches');
  }
};



export const fetchWeather = async (latitude, longitude) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: API_KEY,
        units: 'metric', // Use 'imperial' for Fahrenheit
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    throw new Error('Could not fetch weather data.');
  }
};