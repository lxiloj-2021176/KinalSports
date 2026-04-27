import { axiosAuth } from './api.js';

export const login = async (data) => {
  return await axiosAuth.post('/auth/login', data);
};

export const getAllUsers = async () => {
  const { data } = await axiosAuth.get('/auth/users');
  return { users: data };
};

//Se agrega data porque se necesita enviar mucha informacion
export const register = async (data) => {
  return await axiosAuth.post('/auth/register', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

//No se agrega data porque solo se necesita el token
export const verifyEmail = async (token) => {
  return await axiosAuth.post(`/auth/verify-email`, { token });
};