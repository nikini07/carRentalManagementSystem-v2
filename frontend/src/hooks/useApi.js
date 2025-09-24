// frontend/src/hooks/useApi.js
import { useCallback } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8080';

export const useApi = () => {
  const api = useCallback(axios.create({ baseURL: API_BASE }), []);

  return { api };
};