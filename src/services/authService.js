import axios from 'axios';
import { BASE_API_URL } from '../AppConfig.js';
import { ROLE, USERNAME } from '../constants/localStorageKeys.js';
import { ADMIN_ROLE, NORMAL_USER_ROLE, ORGANIZATION_ROLE } from '../constants/roles.js';

const api = axios.create({
  baseURL: BASE_API_URL + 'petition/user/',
  withCredentials: true,
});

const registerApi = axios.create({
  baseURL: BASE_API_URL + 'register/',
  withCredentials: true,
});

export const authService = {
  register: async (userData) => {
    const response = await api.post('register', userData);
    if (response.status === 201) {
      localStorage.setItem(USERNAME, userData.username);
      localStorage.setItem(ROLE, 'petition_user');
      return response.data;
    } else {
      throw new Error('Registration failed');
    }
  },

  registerStep1: async () => {
    const response = await registerApi.get('1');
    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      throw new Error('Rejestracja krok 1 nie powiodła się');
    }
  },

  registerStep2Poll: async (documentId, signal) => {
    const response = await registerApi.get(`2/${documentId}`, {
      signal,
      timeout: 5 * 60 * 1000,
    });
    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      throw new Error('Weryfikacja tożsamości nie powiodła się');
    }
  },

  registerStep3: async (commitment) => {
    const response = await registerApi.post('3', { commitment });
    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      throw new Error('Rejestracja krok 3 nie powiodła się');
    }
  },

  login: async (credentials) => {
    const response = await api.post('login', credentials);
    if (response.status === 200) {
      localStorage.setItem(USERNAME, credentials.username);
      localStorage.setItem(ROLE, 'petition_user');
      return response.data;
    } else {
      throw new Error('Login failed');
    }
  },

  logout: () => {
    localStorage.removeItem(ROLE);
    localStorage.removeItem(USERNAME);
  },

  isAdmin: () => localStorage.getItem(ROLE) === ADMIN_ROLE,
  isOrganization: () => localStorage.getItem(ROLE) === ORGANIZATION_ROLE,
  isNormalUser: () => localStorage.getItem(ROLE) === NORMAL_USER_ROLE,
  getUserName: () => localStorage.getItem(USERNAME),
};
