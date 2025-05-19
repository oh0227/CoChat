import axios from "axios";

const BASE_URL = "http://localhost:8000"; // 예: http://192.168.0.5:8000

// 토큰이 필요한 경우
const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const createUser = async (userData) => {
  const response = await axios.post(`${BASE_URL}/user`, userData);
  return response.data;
};

export const getAllUsers = async (token) => {
  const response = await axios.get(`${BASE_URL}/user`, getAuthHeader(token));
  return response.data;
};

export const getUserById = async (id, token) => {
  const response = await axios.get(
    `${BASE_URL}/user/${id}`,
    getAuthHeader(token)
  );
  return response.data;
};

export const updateUser = async (id, userData, token) => {
  const response = await axios.post(
    `${BASE_URL}/user/${id}/update`,
    userData,
    getAuthHeader(token)
  );
  return response.data;
};

export const deleteUser = async (id, token) => {
  const response = await axios.get(
    `${BASE_URL}/user/delete/${id}`,
    getAuthHeader(token)
  );
  return response.data;
};
