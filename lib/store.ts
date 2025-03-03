import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, UploadStatus, ProductsResponse, GetProductsParams } from '../types';
import { getUploadStatus, getProducts } from './api';

interface AppState {
  jobIds: string[];
  products: Product[];
  uploadStatuses: { [jobId: string]: UploadStatus };
  page: number;
  limit: number;
  totalPages: number;
  nameFilter: string;
  priceFilter: string;
  expirationFilter: string;
  sortBy: 'name' | 'price' | 'expiration' | null;
  order: 'ASC' | 'DESC';
  isLoading: boolean;
  shouldFetchStatuses: boolean;
  setJobIds: (jobIds: string[]) => void;
  fetchUploadStatus: (jobId: string) => Promise<UploadStatus>;
  fetchAllUploadStatuses: () => Promise<UploadStatus[]>;
  fetchProducts: (params?: GetProductsParams) => Promise<void>;
  setNameFilter: (name: string) => void;
  setPriceFilter: (price: string) => void;
  setExpirationFilter: (expiration: string) => void;
  setSort: (sortBy: 'name' | 'price' | 'expiration' | null, order: 'ASC' | 'DESC') => void;
  setLimit: (limit: number) => void;
  clearUploadStatuses: () => void;
  setShouldFetchStatuses: (value: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      jobIds: [],
      products: [],
      uploadStatuses: {},
      page: 1,
      limit: 10,
      totalPages: 1,
      nameFilter: '',
      priceFilter: '',
      expirationFilter: '',
      sortBy: null,
      order: 'ASC',
      isLoading: false,
      shouldFetchStatuses: false,
      setJobIds: (jobIds: string[]) => set({ jobIds, shouldFetchStatuses: true }),
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
      fetchProducts: async (params = {}) => {
        set({ isLoading: true });
        const { page, limit, nameFilter, priceFilter, expirationFilter, sortBy, order } = get();
        const response: ProductsResponse = await getProducts({
          page,
          limit,
          name: nameFilter || undefined,
          price: priceFilter ? Number(priceFilter) : undefined,
          expiration: expirationFilter || undefined,
          sortBy: sortBy || undefined,
          order,
          ...params,
        });
        set({
          products: response.data,
          page: response.page,
          limit: response.limit,
          totalPages: response.totalPages,
          isLoading: false,
        });
      },
      setNameFilter: (name: string) => {
        set({ nameFilter: name, page: 1 });
        get().fetchProducts();
      },
      setPriceFilter: (price: string) => {
        set({ priceFilter: price, page: 1 });
        get().fetchProducts();
      },
      setExpirationFilter: (expiration: string) => {
        set({ expirationFilter: expiration, page: 1 });
        get().fetchProducts();
      },
      setSort: (sortBy: 'name' | 'price' | 'expiration' | null, order: 'ASC' | 'DESC') => {
        set({ sortBy, order, page: 1 });
        get().fetchProducts();
      },
      setLimit: (limit: number) => {
        set({ limit, page: 1 });
        get().fetchProducts();
      },
      clearUploadStatuses: () => set({ uploadStatuses: {}, shouldFetchStatuses: false }),
      setShouldFetchStatuses: (value: boolean) => set({ shouldFetchStatuses: value }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ jobIds: state.jobIds }),
    }
  )
);