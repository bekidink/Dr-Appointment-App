import { AxiosRequestConfig } from 'axios';
import axiosInstance from './axiosInstance';

export const fetchData = async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await axiosInstance.get<T>(endpoint, config);
    return response.data;
  } catch (error: any) {
    console.log("erroe",error)
    throw new Error(error.response?.data?.message || error.message || 'API GET call failed');
  }
};



export const postData = async <T, U>(
  endpoint: string,
  data: U,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axiosInstance.post<T>(endpoint, data, config);
    return response.data;
  } catch (error: any) {
    console.log('error', error);
    throw new Error(error.response?.data?.message || error.message || 'API POST call failed');
  }
};
