import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductsTable } from '../../products/ProductsTable';
import { useProductTable } from '@/lib/hooks/useProductTable';

jest.mock('@/lib/hooks/useProductTable');
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'> & { children: React.ReactNode }) => (
    <button {...props}>{children}</button>
  ),
}));

describe('ProductsTable', () => {
  const mockUseProductTable = {
    products: [
      { id: 1, name: 'Product', price: 10, expiration: '2025-12-31', exchangeRates: { USD: 10, EUR: 9, GBP: 8, JPY: 1000, BRL: 50 } },
    ],
    allErrors: [],
    page: 1,
    limit: 10,
    totalPages: 1,
    isLoading: false,
    isTransitioning: false,
    localNameFilter: '',
    localPriceFilter: '',
    localExpirationFilter: '',
    sortBy: null,
    order: 'ASC',
    setLocalNameFilter: jest.fn(),
    setLocalPriceFilter: jest.fn(),
    setLocalExpirationFilter: jest.fn(),
    handleSort: jest.fn(),
    handlePageChange: jest.fn(),
    setLimit: jest.fn(),
  };

  beforeEach(() => {
    (useProductTable as jest.Mock).mockReturnValue(mockUseProductTable);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders table with product data', async () => {
    render(<ProductsTable />);
    await waitFor(() => {
      expect(screen.getByText('Product')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('2025-12-31')).toBeInTheDocument();
    });
  });

  it('shows loading state', async () => {
    (useProductTable as jest.Mock).mockReturnValue({ ...mockUseProductTable, isLoading: true, products: [] });
    render(<ProductsTable />);
    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  it('calls handleSort on column header click', async () => {
    render(<ProductsTable />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Name'));
      expect(mockUseProductTable.handleSort).toHaveBeenCalledWith('name');
    });
  });

  it('displays errors when present', async () => {
    (useProductTable as jest.Mock).mockReturnValue({
      ...mockUseProductTable,
      allErrors: [{ line: 1, error: 'Invalid price' }],
    });
    render(<ProductsTable />);
    await waitFor(() => {
      expect(screen.getByText('Line 1: Invalid price')).toBeInTheDocument();
    });
  });
});