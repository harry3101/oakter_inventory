import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        message: error.response.data?.message || 'An error occurred'
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error: No response received', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Inventory endpoints
export const inventoryApi = {
  getAll: (type?: string, status?: string) => 
    api.get(`/inventory?${type ? `type=${type}` : ''}${status ? `&status=${status}` : ''}`),
  getById: (id: string) => api.get(`/inventory/${id}`),
  createLaptop: (data: any) => api.post('/inventory/laptop', data),
  createAdapter: (data: any) => api.post('/inventory/adapter', data),
  createPrinter: (data: any) => api.post('/inventory/printer', data),
  createMiscItem: (data: any) => api.post('/inventory/misc', data),
  update: (id: string, data: any) => api.patch(`/inventory/${id}`, data),
  delete: (id: string) => api.delete(`/inventory/${id}`),
};

// Assignment endpoints
export const assignmentApi = {
  getAll: () => api.get('/assignments'),
  getHistory: () => api.get('/assignments/history'),
  getActive: () => api.get('/assignments/active'),
  getById: (id: string) => api.get(`/assignments/${id}`),
  create: (data: any) => api.post('/assignments', data),
  returnItem: (id: string, data: any) => api.patch(`/assignments/${id}/return`, data),
  update: (id: string, data: any) => api.patch(`/assignments/${id}`, data),
  delete: (id: string) => api.delete(`/assignments/${id}`),
};

// Employee endpoints
export const employeeApi = {
  getAll: () => api.get('/employees'),
  getById: (id: string) => api.get(`/employees/${id}`),
  getByEmployeeId: (empId: string) => api.get(`/employees/employeeId/${empId}`),
  create: (data: any) => api.post('/employees', data),
  update: (id: string, data: any) => api.patch(`/employees/${id}`, data),
  delete: (id: string) => api.delete(`/employees/${id}`),
};

// Update TypeScript interfaces to match the models
export const updateTypes = () => {
  // This is a placeholder function - the actual type updates would be in the types/index.ts file
  console.log("Types should be updated to match models");
};

export default api;
