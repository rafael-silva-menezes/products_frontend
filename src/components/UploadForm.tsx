import React from 'react';
import axios from 'axios';

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
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
  
    console.log('Upload started:', new Date().toISOString());
    setIsUploading(true);
    setUploadSuccess(false);
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post('http://localhost:8000/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Upload response:', response.data);
  
      if (response.status === 200) {
        console.log('Upload successful, setting state...');
        setUploadSuccess(true);
        const productsResponse = await axios.get('http://localhost:8000/products');
        console.log('Products fetched:', productsResponse.data);
        setProducts(productsResponse.data);
      }
    } catch (error: any) {
      console.error('Upload failed:', error.response?.data?.message || error.message);
      alert(`Upload error: ${error.response?.data?.message || 'Unknown error'}`);
      setUploadSuccess(false);
    } finally {
      setIsUploading(false);
      console.log('Upload process finished');
    }
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
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default UploadForm;