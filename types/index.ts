export interface Product {
  id: number;
  name: string;
  price: number;
  expiration: string;
  exchangeRates: { [key: string]: number };
}

export interface CsvError {
  line: number;
  error: string;
}

export interface UploadStatus {
  status: string;
  processed?: number;
  errors?: CsvError[];
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UploadResponse {
  message: string;
  jobIds: string[];
}