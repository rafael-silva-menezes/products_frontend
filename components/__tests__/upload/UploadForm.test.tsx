import { render, screen, fireEvent } from '@testing-library/react';
import { useUpload } from '@/lib/hooks/useUpload';
import { UploadForm } from '@/components/upload/UploadForm';

jest.mock('@/lib/hooks/useUpload');
jest.mock('next-themes', () => ({
  useTheme: jest.fn(() => ({ theme: 'light', setTheme: jest.fn() })),
}));
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'> & { children: React.ReactNode }) => (
    <button {...props}>{children}</button>
  ),
}));


describe('UploadForm', () => {
  const mockUseUpload = {
    uploadPhase: 'idle',
    message: null,
    errorMessage: null,
    handleFileChange: jest.fn(),
    handleUpload: jest.fn(),
    isButtonDisabled: false,
  };

  beforeEach(() => {
    (useUpload as jest.Mock).mockReturnValue(mockUseUpload);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders file input and upload button', () => {
    render(<UploadForm />);
    expect(screen.getByLabelText(/select a csv file/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
  });

  it('calls handleFileChange when a file is selected', () => {
    render(<UploadForm />);
    const input = screen.getByLabelText(/select a csv file/i);
    const file = new File([''], 'test.csv', { type: 'text/csv' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(mockUseUpload.handleFileChange).toHaveBeenCalled();
  });

  it('calls handleUploadAndClear when upload button is clicked', async () => {
    render(<UploadForm />);
    const button = screen.getByRole('button', { name: /upload/i });
    fireEvent.click(button);
    expect(mockUseUpload.handleUpload).toHaveBeenCalled();
  });

  it('disables button when isButtonDisabled is true', () => {
    (useUpload as jest.Mock).mockReturnValue({ ...mockUseUpload, isButtonDisabled: true });
    render(<UploadForm />);
    const button = screen.getByRole('button', { name: /upload/i });
    expect(button).toBeDisabled();
  });

  it('displays error message when present', () => {
    (useUpload as jest.Mock).mockReturnValue({ ...mockUseUpload, errorMessage: 'Invalid file' });
    render(<UploadForm />);
    expect(screen.getByText('Invalid file')).toBeInTheDocument();
  });
});