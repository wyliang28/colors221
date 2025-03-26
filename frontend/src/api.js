import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';  // 根据实际情况修改
//const API_URL = "http://backend:5001/api";

export const getColors = async () => {
  const response = await axios.get(`${API_URL}/colors`);
  return response.data;
};

export const getPackages = async () => {
  const response = await axios.get(`${API_URL}/packages`);
  return response.data;
};

export const createPackage = async (packageData) => {
  const response = await axios.post(`${API_URL}/packages`, packageData);
  return response.data;
};

export const deletePackage = async (id) => {
  const response = await axios.delete(`${API_URL}/packages/${id}`);
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await axios.post(`${API_URL}/orders`, orderData);
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await axios.delete(`${API_URL}/orders/${id}`);
  return response.data;
};

export const getOrders = async () => {
  const response = await axios.get(`${API_URL}/orders`);
  return response.data;
};

export const createIncreaseStock = async (colorName, increaseNum) => {
  const response = await axios.post(`${API_URL}/increasestock`, {
    name: colorName,
    increase_num: increaseNum,
  });
  return response.data;
};

// 获取库存增加记录
export const getIncreaseStock = async () => {
  const response = await axios.get(`${API_URL}/increasestock`);
  return response.data;
};