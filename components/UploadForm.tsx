'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { uploadCsv, getUploadStatus } from '../lib/api';

interface UploadFormProps {
  onUploadSuccess: (jobId: string) => void;
}

export function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
      const { jobId } = await uploadCsv(file);
      let status = await getUploadStatus(jobId);
      while (status.status !== 'completed' && status.status !== 'failed') {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        status = await getUploadStatus(jobId);
      }
      setMessage('Upload concluído com sucesso!');
      onUploadSuccess(jobId);
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