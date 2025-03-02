import { create } from 'zustand';
import { Product, UploadStatus, ProductsResponse } from '../types';
import { getUploadStatus, getProducts } from './api';

interface AppState {
  jobId: string | null;
  products: Product[];
  uploadStatus: UploadStatus | null;
  page: number;
  totalPages: number;
  setJobId: (jobId: string) => void;
  fetchUploadStatus: (jobId: string) => Promise<UploadStatus>;
  fetchProducts: (page?: number, limit?: number) => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  jobId: null,
  products: [],
  uploadStatus: null,
  page: 1,
  totalPages: 1,
  setJobId: (jobId: string) => set({ jobId }),
  fetchUploadStatus: async (jobId: string) => {
    const status = await getUploadStatus(jobId);
    set({ uploadStatus: status });
    return status; // Retorna o status para uso direto
  },
  fetchProducts: async (page = 1, limit = 10) => {
    const response: ProductsResponse = await getProducts({ page, limit });
    set({
      products: response.data,
      page: response.page,
      totalPages: response.totalPages,
    });
  },
}));