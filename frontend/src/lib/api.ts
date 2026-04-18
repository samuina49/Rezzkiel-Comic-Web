const API_URL = 'http://localhost:5042/api'; // Match backend port in launchSettings.json

export const api = {
  async get(endpoint: string) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    return handleResponse(res);
  },

  async post(endpoint: string, body: any) {
    const isFormData = body instanceof FormData;
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? body : JSON.stringify(body),
      credentials: 'include'
    });
    return handleResponse(res);
  },

  async put(endpoint: string, body: any) {
    const isFormData = body instanceof FormData;
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? body : JSON.stringify(body),
      credentials: 'include'
    });
    return handleResponse(res);
  },

  async delete(endpoint: string) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return handleResponse(res);
  },
};

async function handleResponse(response: Response) {
  // Check if response has content before parsing JSON
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  // Handle empty bodies (like 204 No Content or simple 200 OK)
  let data = null;
  if (isJson) {
    const text = await response.text();
    data = text ? JSON.parse(text) : null;
  }

  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    throw new Error(error);
  }

  return data;
}
