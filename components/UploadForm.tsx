'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { uploadCsv } from '../lib/api';
import { useAppStore } from '../lib/store';

type UploadPhase = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const { setJobIds, fetchAllUploadStatuses } = useAppStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setUploadPhase('idle');
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploadPhase('uploading');
      setMessage('Enviando arquivo...');
      const { jobIds } = await uploadCsv(file);
      setJobIds(jobIds);

      setUploadPhase('processing');
      setMessage('Arquivo enviado. Processando no backend...');

      let allCompletedOrFailed = false;
      while (!allCompletedOrFailed) {
        const statuses = await fetchAllUploadStatuses();
        const totalProcessed = statuses.reduce(
          (sum, status) => sum + (status.processed || 0),
          0,
        );
        const totalErrors = statuses.reduce(
          (sum, status) => sum + (status.errors?.length || 0),
          0,
        );
        setMessage(
          `Processando... (${totalProcessed} linhas processadas, ${totalErrors} erros)`,
        );

        allCompletedOrFailed = statuses.every(
          (status) => status.status === 'completed' || status.status === 'failed',
        );
        if (!allCompletedOrFailed) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      const hasErrors = Object.values(useAppStore.getState().uploadStatuses).some(
        (status) => status.errors && status.errors.length > 0,
      );
      if (hasErrors) {
        setUploadPhase('completed');
        setMessage('Upload concluído com erros. Verifique abaixo.');
      } else {
        setUploadPhase('completed');
        setMessage('Upload concluído com sucesso!');
      }
    } catch (error) {
      setUploadPhase('failed');
      setMessage(`Erro no upload: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const isButtonDisabled = !file || uploadPhase === 'uploading' || uploadPhase === 'processing';

  return (
    <div className="mb-8">
      <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
        Escolha um arquivo CSV
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-2 border border-gray-300 rounded p-2"
        disabled={uploadPhase === 'uploading' || uploadPhase === 'processing'}
      />
      <Button onClick={handleUpload} disabled={isButtonDisabled}>
        {uploadPhase === 'uploading' && 'Enviando...'}
        {uploadPhase === 'processing' && 'Processando...'}
        {uploadPhase === 'idle' && 'Upload'}
        {uploadPhase === 'completed' && 'Upload Concluído'}
        {uploadPhase === 'failed' && 'Tentar Novamente'}
      </Button>
      {message && (
        <p className={`mt-2 text-sm ${uploadPhase === 'failed' ? 'text-red-500' : 'text-gray-700'}`}>
          {message}
        </p>
      )}
    </div>
  );
}