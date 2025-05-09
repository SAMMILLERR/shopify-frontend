// src/api.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL;

export const fetchProducts = async () => {
  const res = await axios.get(`${API_BASE}/products`);
  return res.data;
};

export const searchProducts = async (query) => {
  const res = await axios.get(`${API_BASE}/products/search?q=${query}`);
  return res.data;
};

export const addProduct = async (product) => {
  const res = await axios.post(`${API_BASE}/products`, product);
  return res.data;
};
