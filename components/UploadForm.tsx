'use client';

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

  return (
    <div className="mb-8">
      <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
        Select a CSV file
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
        {uploadPhase === 'uploading' && 'Sending...'}
        {uploadPhase === 'processing' && 'Processing...'}
        {uploadPhase === 'idle' && 'Upload'}
        {uploadPhase === 'completed' && 'Upload Completed'}
        {uploadPhase === 'failed' && 'Try Again'}
      </Button>
      {message && (
        <p className={`mt-2 text-sm ${uploadPhase === 'failed' ? 'text-red-500' : 'text-gray-700'}`}>
          {message}
        </p>
      )}
      {errorMessage && (
        <p className="mt-2 text-sm text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
}