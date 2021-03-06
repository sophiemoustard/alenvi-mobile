import getEnvVars from '../../environment';
import { MOBILE } from '../core/data/constants';
import { alenviAxios } from './ressources/alenviAxios';

export default {
  getById: async (id) => {
    const { baseURL } = getEnvVars();
    const user = await alenviAxios.get(`${baseURL}/users/${id}`);
    return user.data.data.user;
  },
  updateById: async (userId, data) => {
    const { baseURL } = getEnvVars();
    await alenviAxios.put(`${baseURL}/users/${userId}`, data);
  },
  updatePassword: async (userId, data, token = '') => {
    const { baseURL } = getEnvVars();
    if (!token) await alenviAxios.put(`${baseURL}/users/${userId}/password`, data);
    else await alenviAxios.put(`${baseURL}/users/${userId}/password`, data, { headers: { 'x-access-token': token } });
  },
  exists: async (params) => {
    const { baseURL } = getEnvVars();
    const exists = await alenviAxios.get(`${baseURL}/users/exists`, { params });
    return exists.data.data.exists;
  },
  create: async (data) => {
    const { baseURL } = getEnvVars();
    const newUser = await alenviAxios.post(`${baseURL}/users`, { ...data, origin: MOBILE });
    return newUser.data.data.user;
  },
  uploadImage: async (userId, data) => {
    const { baseURL } = getEnvVars();
    await alenviAxios.post(`${baseURL}/users/${userId}/upload`, data);
  },
  deleteImage: async (userId) => {
    const { baseURL } = getEnvVars();
    await alenviAxios.delete(`${baseURL}/users/${userId}/upload`);
  },
  addExpoToken: async (userId, formationExpoToken) => {
    const { baseURL } = getEnvVars();
    await alenviAxios.post(`${baseURL}/users/${userId}/expo-token`, { formationExpoToken });
  },
  removeExpoToken: async (userId, expoToken) => {
    const { baseURL } = getEnvVars();
    await alenviAxios.delete(`${baseURL}/users/${userId}/expo-token/${expoToken}`);
  },
};
