'use client';

import { UploadForm } from '../components/upload/UploadForm';
import { ProductsTable } from '../components/products/ProductsTable';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
      CSV Upload
      </h1>
      <UploadForm />
      <ProductsTable />
    </main>
  );
}