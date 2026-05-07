
const BASE_URL = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    credentials: 'include', // needed for express session to send/receive cookies
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : (null as unknown as T);
}

export const api = {
  get: <T>(url: string) => request<T>(url, { method: 'GET' }),
  
  post: <T>(url: string, data?: any) => request<T>(url, { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  
};



