import { useState } from 'react';
import { uploadCsv } from '../api';
import { useAppStore } from '../store';

type UploadPhase = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';

export function useUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setJobIds, fetchAllUploadStatuses } = useAppStore();

  const MAX_FILE_SIZE = 1 * 1024 * 1024 * 1024; // 1GB in bytes
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setMessage('Validating file...');
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      if (selectedFile.type !== 'text/csv') {
        setErrorMessage('Please select a valid CSV file.');
        setFile(null);
        setUploadPhase('idle');
        setMessage(null);
        return;
      }

      if (selectedFile.size > MAX_FILE_SIZE) {
        setErrorMessage('File size exceeds 1GB limit.');
        setFile(null);
        setUploadPhase('idle');
        setMessage(null);
        return;
      }

      setFile(selectedFile);
      setUploadPhase('idle');
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploadPhase('uploading');
      setMessage('Sending to server...');
      await delay(500);
      const { jobIds } = await uploadCsv(file);
      setJobIds(jobIds);

      setUploadPhase('processing');
      setMessage('Processing data on the backend...');
      await delay(500);

      let allCompletedOrFailed = false;
      while (!allCompletedOrFailed) {
        setMessage('Saving to database...');
        const statuses = await fetchAllUploadStatuses();
        allCompletedOrFailed = statuses.every(
          (status) => status.status === 'completed' || status.status === 'failed'
        );
        if (!allCompletedOrFailed) {
          await delay(1000);
        }
      }

      const hasErrors = Object.values(useAppStore.getState().uploadStatuses).some(
        (status) => status.errors && status.errors.length > 0
      );
      if (hasErrors) {
        setUploadPhase('completed');
        setMessage('Upload completed with errors. Check below.');
      } else {
        setUploadPhase('completed');
        setMessage('Upload completed successfully!');
        await delay(2000);
      }
      setFile(null); // Limpar o arquivo após upload
    } catch (error) {
      setUploadPhase('failed');
      setMessage(
        `Upload error: ${
          error instanceof Error && error.message.includes('timeout')
            ? 'Upload timed out after 60 seconds.'
            : error instanceof Error
            ? error.message
            : 'Unknown error'
        }`
      );
    }
  };

  const isButtonDisabled = !file || uploadPhase === 'uploading' || uploadPhase === 'processing';

  return {
    file,
    uploadPhase,
    message,
    errorMessage,
    handleFileChange,
    handleUpload,
    isButtonDisabled,
  };
}