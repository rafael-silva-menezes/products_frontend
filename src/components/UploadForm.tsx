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
    if (!file) return; // Does nothing if no file has been selected

    setIsUploading(true); // Activate the loading indicator
    setUploadSuccess(false); // Reset previous success

    const formData = new FormData();
    formData.append('file', file); // Add file to FormData

    try {
      // Sends the file to the backend endpoint
      const response = await axios.post('http://localhost:3000/products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setUploadSuccess(true); // Marks the upload as successful
        // After success, fetches the products from the backend
        const productsResponse = await axios.get('http://localhost:3000/products');
        setProducts(productsResponse.data); // Updates the product list
      }
    } catch (error: any) {
      console.error('Error sending file:', error);
      alert(`Upload error: ${error.response?.data?.message || 'Unknown error'}`);
      setUploadSuccess(false);
    } finally {
      setIsUploading(false); // Deactivate the loading indicator
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