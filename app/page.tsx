'use client';

import { UploadForm } from '../components/UploadForm';
import { ProductsTable } from '../components/products/ProductsTable';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Flatirons Products
      </h1>
      <UploadForm />
      <ProductsTable />
    </main>
  );
}