import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UploadForm } from '../UploadForm';
import * as api from '../../lib/api';
import { useAppStore } from '../../lib/store';

// Mock do Zustand store
jest.mock('../../lib/store', () => ({
  useAppStore: jest.fn(),
}));

// Mock das funções de API
jest.mock('../../lib/api', () => ({
  uploadCsv: jest.fn(),
  getUploadStatus: jest.fn(),
}));

describe('UploadForm', () => {
  const mockSetJobIds = jest.fn();
  const mockFetchAllUploadStatuses = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useAppStore as jest.MockedFunction<typeof useAppStore>).mockReturnValue({
      setJobIds: mockSetJobIds,
      fetchAllUploadStatuses: mockFetchAllUploadStatuses,
    });
  });

  it('renders input and upload button initially', () => {
    render(<UploadForm />);
    expect(screen.getByLabelText(/escolha um arquivo csv/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload/i })).toBeDisabled();
  });

  it('enables upload button when a file is selected', () => {
    render(<UploadForm />);
    const input = screen.getByLabelText(/escolha um arquivo csv/i) as HTMLInputElement;
    const file = new File(['Apple;1.99;2023-12-31'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByRole('button', { name: /upload/i })).not.toBeDisabled();
  });

  it('shows uploading and processing phases, then success on valid upload', async () => {
    (api.uploadCsv as jest.Mock).mockResolvedValue({ jobIds: ['job1'] });
    (api.getUploadStatus as jest.Mock)
      .mockResolvedValueOnce({ status: 'processing', processed: 1, errors: [] })
      .mockResolvedValueOnce({ status: 'completed', processed: 1, errors: [] });
    mockFetchAllUploadStatuses
      .mockResolvedValueOnce([{ status: 'processing', processed: 1, errors: [] }])
      .mockResolvedValueOnce([{ status: 'completed', processed: 1, errors: [] }]);

    render(<UploadForm />);
    const input = screen.getByLabelText(/escolha um arquivo csv/i) as HTMLInputElement;
    const file = new File(['Apple;1.99;2023-12-31'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /upload/i }));

    expect(await screen.findByText('Enviando...')).toBeInTheDocument();
    expect(screen.getByText('Enviando arquivo...')).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText(/Processando... \(1 linhas processadas, 0 erros\)/)).toBeInTheDocument(),
      { timeout: 2000 }
    );

    await waitFor(() =>
      expect(screen.getByText('Upload concluído com sucesso!')).toBeInTheDocument(),
      { timeout: 2000 }
    );
    expect(mockSetJobIds).toHaveBeenCalledWith(['job1']);
  });

  it('shows error message on upload failure', async () => {
    (api.uploadCsv as jest.Mock).mockRejectedValue(new Error('Network Error'));

    render(<UploadForm />);
    const input = screen.getByLabelText(/escolha um arquivo csv/i) as HTMLInputElement;
    const file = new File(['Apple;1.99;2023-12-31'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /upload/i }));

    expect(await screen.findByText('Enviando...')).toBeInTheDocument();
    expect(await screen.findByText('Erro no upload: Network Error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tentar Novamente/i })).toBeInTheDocument();
  });

  it('shows errors from backend on completed upload with errors', async () => {
    (api.uploadCsv as jest.Mock).mockResolvedValue({ jobIds: ['job1'] });
    (api.getUploadStatus as jest.Mock)
      .mockResolvedValueOnce({ status: 'processing', processed: 0, errors: [] })
      .mockResolvedValueOnce({
        status: 'completed',
        processed: 0,
        errors: [{ line: 1, error: 'Invalid price' }],
      });
    mockFetchAllUploadStatuses
      .mockResolvedValueOnce([{ status: 'processing', processed: 0, errors: [] }])
      .mockResolvedValueOnce([
        { status: 'completed', processed: 0, errors: [{ line: 1, error: 'Invalid price' }] },
      ]);

    render(<UploadForm />);
    const input = screen.getByLabelText(/escolha um arquivo csv/i) as HTMLInputElement;
    const file = new File(['Apple;abc;2023-12-31'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /upload/i }));

    expect(await screen.findByText('Enviando...')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText('Upload concluído com erros. Verifique abaixo.')).toBeInTheDocument(),
      { timeout: 2000 }
    );
  });
});