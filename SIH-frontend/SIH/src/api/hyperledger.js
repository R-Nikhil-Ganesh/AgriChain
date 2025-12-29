import axios from 'axios';
import { auth } from '../../firebaseConfig'; // Firebase auth instance

// --- 1. Backend API base URL ---
// Replace with your host machine's IP address running the backend
const API_URL = 'http://172.17.179.177:3000/api'; 

// --- 2. Axios instance ---
const api = axios.create({
  baseURL: API_URL,
  timeout: 20000, // increased for potentially slow blockchain operations
});

// --- 3. Attach Firebase token to all requests ---
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(true); // force refresh to avoid expiry issues
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API] Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// --- 4. API FUNCTIONS ---

/**
 * Create a new produce batch.
 * @param {object} batchData - { cropType, quantity, unit, farmerName, farmLocation, farmID }
 */
export const createProduceBatch = async (batchData) => {
  try {
    const response = await api.post('/produce', batchData);
    return response.data;
  } catch (error) {
    console.error('[API] createProduceBatch error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to create batch');
  }
};

/**
 * Get complete history of a batch.
 * @param {string} batchId
 */
export const getBatchHistory = async (batchId) => {
  try {
    const response = await api.get(`/produce/${batchId}`);
    return response.data;
  } catch (error) {
    console.error('[API] getBatchHistory error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch batch history');
  }
};

/**
 * Update batch status (and optionally owner).
 * @param {string} batchId
 * @param {object} updateData - { status, details, role, newOwnerUID? }
 */
export const updateBatchStatus = async (batchId, updateData) => {
  try {
    const response = await api.put(`/produce/${batchId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('[API] updateBatchStatus error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to update batch status');
  }
};

/**
 * Fetch all batches created by the currently logged-in farmer.
 */
export const getMyBatches = async () => {
  try {
    const response = await api.get('/produce/my-batches');
    const data = response.data;

    if (data?.assets && Array.isArray(data.assets)) return data.assets;
    if (Array.isArray(data)) return data;
    return [];
  } catch (error) {
    console.error('[API] getMyBatches error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch my batches');
  }
};
