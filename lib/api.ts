import axios from 'axios';
import { ProductsResponse, UploadStatus, UploadResponse, GetProductsParams } from '../types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 60000,
});

export const uploadCsv = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/products/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getUploadStatus = async (jobId: string): Promise<UploadStatus> => {
  const response = await api.get(`/products/upload-status/${jobId}`);
  return response.data;
};

export const getProducts = async (params: GetProductsParams = {}): Promise<ProductsResponse> => {
  const response = await api.get('/products', { params });
  return response.data;
};