import React from 'react';

interface UploadFormProps {
  file: File | null;
  setFile: (file: File | null) => void;
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
  setUploadSuccess: (success: boolean) => void;
  setProducts: (products: any[]) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({
  file,
  setFile,
  isUploading,
  setIsUploading,
  setUploadSuccess,
  setProducts,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    console.log('Upload iniciado:', file);
  };

  return (
    <div className="upload-form">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <button onClick={handleUpload} disabled={!file || isUploading}>
        {isUploading ? 'Enviando...' : 'Upload'}
      </button>
    </div>
  );
};

export default UploadForm;