'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAppStore } from '../lib/store';

export function ProductsTable() {
  const {
    jobIds,
    products,
    uploadStatuses,
    page,
    totalPages,
    fetchAllUploadStatuses,
    fetchProducts,
  } = useAppStore();

  useEffect(() => {
    if (jobIds.length > 0) {
      fetchAllUploadStatuses();
      fetchProducts(page);
    }
  }, [jobIds, page, fetchAllUploadStatuses, fetchProducts]);

  if (jobIds.length === 0) return null;

  const allErrors = Object.values(uploadStatuses)
    .filter((status) => status?.errors && status.errors.length > 0)
    .flatMap((status) => status.errors || []);

  return (
    <div>
      {allErrors.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-red-600">Upload Errors</h2>
          <ul className="list-disc pl-5">
            {allErrors.map((error, index) => (
              <li key={index} className="text-sm text-red-500">
                Row {error.line}: {error.error}
              </li>
            ))}
          </ul>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Expiration</TableHead>
            <TableHead>USD</TableHead>
            <TableHead>EUR</TableHead>
            <TableHead>GBP</TableHead>
            <TableHead>JPY</TableHead>
            <TableHead>BRL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.expiration}</TableCell>
              <TableCell>{product.exchangeRates.USD.toFixed(2)}</TableCell>
              <TableCell>{product.exchangeRates.EUR.toFixed(2)}</TableCell>
              <TableCell>{product.exchangeRates.GBP.toFixed(2)}</TableCell>
              <TableCell>{product.exchangeRates.JPY.toFixed(2)}</TableCell>
              <TableCell>{product.exchangeRates.BRL.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between">
        <Button onClick={() => fetchProducts(page - 1)} disabled={page === 1}>
          Previous
        </Button>
        <span>Page {page} of {totalPages}</span>
        <Button onClick={() => fetchProducts(page + 1)} disabled={page === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
}