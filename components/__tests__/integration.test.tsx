import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UploadForm } from '../upload/UploadForm';
import { ProductsTable } from '../products/ProductsTable';
import { useUpload } from '@/lib/hooks/useUpload';
import { useProductTable } from '@/lib/hooks/useProductTable';
import { uploadCsv } from '@/lib/api';

jest.mock('@/lib/hooks/useUpload');
jest.mock('@/lib/hooks/useProductTable');
jest.mock('@/lib/api');
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'> & { children: React.ReactNode }) => (
    <button {...props}>{children}</button>
  ),
}));
jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: jest.fn() }),
}));

describe('Upload to Table Integration', () => {
  let mockUpload = {
    uploadPhase: 'idle',
    message: null,
    errorMessage: null,
    handleFileChange: jest.fn(),
    handleUpload: jest.fn(),
    isButtonDisabled: false,
  };

  const mockProductTable = {
    products: [],
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
    mockUpload = {
      uploadPhase: 'idle',
      message: null,
      errorMessage: null,
      handleFileChange: jest.fn(),
      handleUpload: jest.fn().mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        (useUpload as jest.Mock).mockReturnValue({
          ...mockUpload,
          uploadPhase: 'completed',
          message: 'Upload completed successfully!',
        });
      }),
      isButtonDisabled: false,
    };

    (useUpload as jest.Mock).mockReturnValue(mockUpload);
    (useProductTable as jest.Mock).mockReturnValue(mockProductTable);
    (uploadCsv as jest.Mock).mockResolvedValue({ jobIds: ['job1'], message: 'Upload started' });
    mockUpload.uploadPhase = 'idle';
    mockUpload.message = null;
    mockUpload.errorMessage = null;
    mockProductTable.products = [];
    mockProductTable.allErrors = [];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uploads a file and updates the table', async () => {
    const { rerender } = render(
      <>
        <UploadForm />
        <ProductsTable />
      </>
    );

    const input = screen.getByLabelText(/select a csv file/i);
    const file = new File(['name,price,expiration\nTest,10,2025-12-31'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(input, { target: { files: [file] } });

    const uploadButton = screen.getByRole('button', { name: /upload/i });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(mockUpload.handleUpload).toHaveBeenCalled();
    });

    (useProductTable as jest.Mock).mockReturnValue({
      ...mockProductTable,
      products: [
        {
          id: 1,
          name: 'Test',
          price: 10,
          expiration: '2025-12-31',
          exchangeRates: {
            USD: 10,
            EUR: 9,
            GBP: 8,
            JPY: 1000,
            BRL: 50,
          },
        },
      ],
    });

    rerender(
      <>
        <UploadForm />
        <ProductsTable />
      </>
    );
  });
});