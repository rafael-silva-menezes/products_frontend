import { create } from 'zustand';
import { Product, UploadStatus, ProductsResponse } from '../types';
import { getUploadStatus, getProducts } from './api';

interface AppState {
  jobIds: string[];
  products: Product[];
  uploadStatuses: { [jobId: string]: UploadStatus };
  page: number;
  totalPages: number;
  setJobIds: (jobIds: string[]) => void;
  fetchUploadStatus: (jobId: string) => Promise<UploadStatus>;
  fetchAllUploadStatuses: () => Promise<UploadStatus[]>;
  fetchProducts: (page?: number, limit?: number) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  jobIds: [],
  products: [],
  uploadStatuses: {},
  page: 1,
  totalPages: 1,
  setJobIds: (jobIds: string[]) => set({ jobIds }),
  fetchUploadStatus: async (jobId: string) => {
    const status = await getUploadStatus(jobId);
    set((state) => ({
      uploadStatuses: { ...state.uploadStatuses, [jobId]: status },
    }));
    return status;
  },
  fetchAllUploadStatuses: async () => {
    const { jobIds, fetchUploadStatus } = get();
    const statuses = await Promise.all(jobIds.map((jobId) => fetchUploadStatus(jobId)));
    return statuses;
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