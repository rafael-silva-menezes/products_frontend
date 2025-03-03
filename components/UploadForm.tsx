'use client';

import React from 'react'; // Adicionado o import do React
import { Button } from '@/components/ui/button';
import { useUpload } from '../lib/hooks/useUpload';

export function UploadForm() {
  const {
    uploadPhase,
    message,
    errorMessage,
    handleFileChange,
    handleUpload,
    isButtonDisabled,
  } = useUpload();

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadAndClear = async () => {
    await handleUpload();
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Limpa o input após upload
    }
  };

  return (
    <div className="mb-8">
      <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
        Select a CSV file
      </label>
      <div className="flex items-center gap-4">
        <input
          id="file-upload"
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="border border-gray-300 rounded p-2 text-sm"
          disabled={uploadPhase === 'uploading' || uploadPhase === 'processing'}
        />
        <Button onClick={handleUploadAndClear} disabled={isButtonDisabled}>
          {uploadPhase === 'uploading' && 'Sending...'}
          {uploadPhase === 'processing' && 'Processing...'}
          {uploadPhase === 'idle' && 'Upload'}
          {uploadPhase === 'completed' && 'Upload Completed'}
          {uploadPhase === 'failed' && 'Try Again'}
        </Button>
      </div>
      {message && (
        <p className={`mt-2 text-sm ${uploadPhase === 'failed' ? 'text-red-500' : 'text-gray-700'}`}>
          {message}
        </p>
      )}
      {errorMessage && (
        <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}