import axios from 'axios';
const base = process.env.NEXT_PUBLIC_API_BASE!;
export const api = axios.create({ baseURL: base });

// Initialize token from localStorage on the client (persists across reloads)
if (typeof window !== 'undefined') {
  const existing = window.localStorage.getItem('fhp_token');
  if (existing) {
    api.defaults.headers.common['Authorization'] = `Bearer ${existing}`;
  }
}

export function setToken(token?: string){
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('fhp_token', token);
    }
  } else {
    delete (api.defaults.headers.common as any)['Authorization'];
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('fhp_token');
    }
  }
}

