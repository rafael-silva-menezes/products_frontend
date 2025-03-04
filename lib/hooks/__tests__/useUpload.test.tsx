import { renderHook, act } from '@testing-library/react';
import { useUpload } from '../useUpload';
import { uploadCsv } from '@/lib/api';
import { useAppStore } from '@/lib/store';

jest.mock('@/lib/api', () => ({
  uploadCsv: jest.fn(),
}));

describe('useUpload', () => {
  beforeEach(() => {
    (uploadCsv as jest.Mock).mockResolvedValue({ jobIds: ['job1'], message: 'Upload started' });

    useAppStore.setState({
      jobIds: [],
      uploadStatuses: {},
      products: [],
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
    });

    useAppStore.setState({
      fetchAllUploadStatuses: jest.fn(async () => {
        useAppStore.setState({
          uploadStatuses: { job1: { status: 'completed' } },
        });
        return [{ status: 'completed' }];
      }),
      fetchProducts: jest.fn(async () => {
        useAppStore.setState({
          products: [{ id: 1, name: 'Test', price: 10, expiration: '2025-12-31', exchangeRates: { USD: 10 } }],
          page: 1,
          totalPages: 1,
          isLoading: false,
        });
      }),
    });

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('rejects invalid file type', () => {
    const { result } = renderHook(() => useUpload());
    const mockEvent = {
      target: { files: [new File([''], 'test.txt', { type: 'text/plain' })] },
    };

    act(() => {
      result.current.handleFileChange(mockEvent as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.errorMessage).toBe('Please select a valid CSV file.');
    expect(result.current.file).toBeNull();
    expect(result.current.uploadPhase).toBe('idle');
    expect(result.current.message).toBeNull();
  });

  it('rejects file exceeding size limit', () => {
    const largeFile = new File([''], 'test.csv', { type: 'text/csv' });
    Object.defineProperty(largeFile, 'size', { value: 2 * 1024 * 1024 * 1024 });

    const { result } = renderHook(() => useUpload());
    const mockEvent = {
      target: { files: [largeFile] },
    };

    act(() => {
      result.current.handleFileChange(mockEvent as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.errorMessage).toBe('File size exceeds 1GB limit.');
    expect(result.current.file).toBeNull();
    expect(result.current.uploadPhase).toBe('idle');
    expect(result.current.message).toBeNull();
  });

  it('accepts valid CSV file', () => {
    const { result } = renderHook(() => useUpload());
    const mockEvent = {
      target: { files: [new File([''], 'test.csv', { type: 'text/csv' })] },
    };

    act(() => {
      result.current.handleFileChange(mockEvent as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.errorMessage).toBeNull();
    expect(result.current.file).toEqual(mockEvent.target.files[0]);
    expect(result.current.uploadPhase).toBe('idle');
    expect(result.current.message).toBeNull();
  });

  it('handles successful upload without errors', async () => {
    const { result } = renderHook(() => useUpload());
    const mockEvent = {
      target: { files: [new File(['name,price\nTest,10'], 'test.csv', { type: 'text/csv' })] },
    };

    act(() => {
      result.current.handleFileChange(mockEvent as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleUpload();
    });

    expect(result.current.uploadPhase).toBe('completed');
    expect(result.current.message).toBe('Upload completed successfully!');
    expect(useAppStore.getState().jobIds).toEqual(['job1']);
    expect(useAppStore.getState().uploadStatuses).toEqual({ job1: { status: 'completed' } });
    expect(result.current.file).toBeNull();
  });

  it('handles upload with errors in statuses', async () => {
    const { result } = renderHook(() => useUpload());
    const mockEvent = {
      target: { files: [new File(['name,price\nTest,10'], 'test.csv', { type: 'text/csv' })] },
    };

    useAppStore.setState({
      fetchAllUploadStatuses: jest.fn(async () => {
        useAppStore.setState({
          uploadStatuses: {
            job1: { status: 'completed', errors: [{ line: 1, error: 'Invalid price' }] },
          },
        });
        return [{ status: 'completed', errors: [{ line: 1, error: 'Invalid price' }] }];
      }),
    });

    act(() => {
      result.current.handleFileChange(mockEvent as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleUpload();
    });

    expect(result.current.uploadPhase).toBe('completed');
    expect(result.current.message).toBe('Upload completed with errors. Check below.');
    expect(useAppStore.getState().jobIds).toEqual(['job1']);
    expect(useAppStore.getState().uploadStatuses).toEqual({
      job1: { status: 'completed', errors: [{ line: 1, error: 'Invalid price' }] },
    });
  });

  it('handles upload failure with API error', async () => {
    const { result } = renderHook(() => useUpload());
    const mockEvent = {
      target: { files: [new File(['name,price\nTest,10'], 'test.csv', { type: 'text/csv' })] },
    };

    (uploadCsv as jest.Mock).mockRejectedValue(new Error('Network error'));

    act(() => {
      result.current.handleFileChange(mockEvent as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleUpload();
    });

    expect(result.current.uploadPhase).toBe('failed');
    expect(result.current.message).toBe('Upload error: Network error');
    expect(useAppStore.getState().jobIds).toEqual([]);
  });
});