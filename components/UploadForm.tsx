'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { uploadCsv } from '../lib/api';
import { useAppStore } from '../lib/store';

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { setJobIds, fetchAllUploadStatuses } = useAppStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    setMessage(null);
    try {
      const { jobIds } = await uploadCsv(file);
      setJobIds(jobIds);
      let allCompletedOrFailed = false;
      while (!allCompletedOrFailed) {
        const statuses = await fetchAllUploadStatuses();
        allCompletedOrFailed = statuses.every(
          (status) => status.status === 'completed' || status.status === 'failed',
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      const hasErrors = Object.values(useAppStore.getState().uploadStatuses).some(
        (status) => status.errors && status.errors.length > 0,
      );
      if (hasErrors) {
        setMessage('Upload concluído com erros. Verifique abaixo.');
      } else {
        setMessage('Upload concluído com sucesso!');
      }
    } catch (error) {
      setMessage(`Erro no upload: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-2 border border-gray-300 rounded p-2"
      />
      <Button onClick={handleUpload} disabled={!file || isLoading}>
        {isLoading ? 'Enviando...' : 'Upload'}
      </Button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}