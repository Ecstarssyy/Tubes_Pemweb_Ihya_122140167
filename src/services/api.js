// src/services/api.js
const API_BASE_URL = 'http://localhost:6543'; // Pastikan ini base URL yang benar untuk Pyramid

async function request(endpoint, method = 'GET', data = null, customHeaders = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`; 
  }

  const config = {
    method: method,
    headers: headers,
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);
    
    if (response.status === 204 || response.headers.get('Content-Length') === '0') {
        return null; 
    }

    const responseData = await response.json().catch(e => {
        console.error("Failed to parse JSON response for URL:", url, "Status:", response.status, e);
        throw new Error(`Server returned non-JSON response or network error. Status: ${response.status} ${response.statusText}`);
    });

    if (!response.ok) {
      const errorMessage = responseData?.error || responseData?.message || response.statusText || `Error ${response.status}`;
      throw new Error(`API Error: ${response.status} - ${errorMessage}`);
    }
    
    return responseData;
  } catch (error) {
    let errorToThrow = error;
    if (!(error instanceof Error && error.message.startsWith('API Error:'))) {
        errorToThrow = new Error(`Network or unexpected error during API request to ${method} ${url}: ${error.message}`);
    }
    console.error(errorToThrow.message, error);
    throw errorToThrow; 
  }
}

// PASTIKAN BAGIAN EXPORT INI ADA DAN BENAR:
export const get = (endpoint, headers) => request(endpoint, 'GET', null, headers);
export const post = (endpoint, data, headers) => request(endpoint, 'POST', data, headers);
export const put = (endpoint, data, headers) => request(endpoint, 'PUT', data, headers);
export const del = (endpoint, headers) => request(endpoint, 'DELETE', null, headers); // 'delete' adalah reserved keyword