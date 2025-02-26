import React, { useState } from 'react';
import './index.css';
import './styles.css';
import UploadForm from './components/UploadForm';
import LoadingIndicator from './components/LoadingIndicator';
import ProductTable from './components/ProductTable';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  return (
    <div className="app">
      <h1>Flatirons Product Upload</h1>
      <UploadForm
        file={file}
        setFile={setFile}
        isUploading={isUploading}
        setIsUploading={setIsUploading}
        setUploadSuccess={setUploadSuccess}
        setProducts={setProducts}
      />
      {isUploading && <LoadingIndicator />}
      {uploadSuccess && (
        <div>
          <p className="success-message">Upload completed successfully!</p>
          <ProductTable products={products} />
        </div>
      )}
    </div>
  );
};

export default App;