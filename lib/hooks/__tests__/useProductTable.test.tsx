import { renderHook, act } from '@testing-library/react';
import { useProductTable } from '../useProductTable';
import { useAppStore } from '@/lib/store';

jest.mock('@/lib/store', () => ({
  useAppStore: jest.fn(),
}));

describe('useProductTable', () => {
  const mockStore = {
    jobIds: [],
    products: [],
    uploadStatuses: {},
    allErrors: [],
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
    fetchProducts: jest.fn(),
    fetchAllUploadStatuses: jest.fn(),
    setNameFilter: jest.fn(),
    setPriceFilter: jest.fn(),
    setExpirationFilter: jest.fn(),
    setSort: jest.fn(),
    setLimit: jest.fn(),
    clearUploadStatuses: jest.fn(),
  };

  beforeEach(() => {
    (useAppStore as jest.MockedFunction<typeof useAppStore>).mockReturnValue(mockStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('updates filter with debounce', async () => {
    const { result } = renderHook(() => useProductTable());

    await act(async () => {
      result.current.setLocalNameFilter('test');
      await new Promise((resolve) => setTimeout(resolve, 300));
    });

    expect(mockStore.setNameFilter).toHaveBeenCalledWith('test');
    expect(mockStore.clearUploadStatuses).toHaveBeenCalled();
  });

  it('handles sort', () => {
    const { result } = renderHook(() => useProductTable());

    act(() => {
      result.current.handleSort('name');
    });

    expect(mockStore.setSort).toHaveBeenCalledWith('name', 'ASC');
    expect(mockStore.clearUploadStatuses).toHaveBeenCalled();
  });
});