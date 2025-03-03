'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useUpload } from '../lib/hooks/useUpload';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function UploadForm() {
  const {
    uploadPhase,
    message,
    errorMessage,
    handleFileChange,
    handleUpload,
    isButtonDisabled,
  } = useUpload();

  const { theme, setTheme } = useTheme();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadAndClear = async () => {
    await handleUpload();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Select a CSV file
        </label>
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <input
          id="file-upload"
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="border border-gray-300 rounded p-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
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
        <p className={`mt-2 text-sm ${uploadPhase === 'failed' ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
          {message}
        </p>
      )}
      {errorMessage && (
        <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}