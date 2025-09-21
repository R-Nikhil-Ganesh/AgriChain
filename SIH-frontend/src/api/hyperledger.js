import axios from 'axios';
import { auth } from '../../firebaseConfig'; // Import Firebase auth instance

// IMPORTANT: Replace this with your actual Hyperledger backend API endpoint
const API_URL = 'http://192.168.1.10:3000/api'; // Example local network URL

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
});

// --- UPDATED INTERCEPTOR ---
// Add a request interceptor to include the Firebase ID token in headers
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      // Get the latest ID token for the user.
      // Firebase SDK automatically handles refreshing the token if it's expired.
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// --- AUTHENTICATION APIS (No longer needed, handled by Firebase on client) ---

// All other functions remain the same as they were.
// Their implementation doesn't need to change because the interceptor
// automatically adds the required auth header to every outgoing request.

// --- PRODUCE & BATCH APIS ---

/**
 * Creates a new produce batch on the blockchain.
 * @param {object} batchData - { cropName, quantity, harvestDate, price }
 * @returns {Promise<object>}
 */
export const createProduceBatch = async (batchData) => {
    try {
        const response = await api.post('/produce', batchData);
        return response.data; // e.g., { success: true, batchId: '...' }
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
 * @param {object} updateData - { status, location, quality, role etc. }
 * @returns {Promise<object>}
 */
export const updateBatchStatus = async (batchId, updateData) => {
    try {
        const response = await api.put(`/produce/${batchId}`, updateData);
        return response.data;
    } catch (error) {
        console.error('API Error: updateBatchStatus', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to update batch');
    }
};
