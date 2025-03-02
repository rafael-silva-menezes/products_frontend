'use client';

import { ProductsTable } from '@/components/ProductsTable';
import { UploadForm } from '@/components/UploadForm';
import { useState } from 'react';


export default function Home() {
  const [jobId, setJobId] = useState<string | null>(null);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Flatirons Products</h1>
      <UploadForm onUploadSuccess={setJobId} />
      {jobId && <ProductsTable jobId={jobId} />}
    </main>
  );
}