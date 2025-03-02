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
import sanitizeHtml from 'sanitize-html';

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

  // Function to export table data to CSV
  const exportToCsv = () => {
    const headers = ['Name', 'Price', 'Expiration', 'USD', 'EUR', 'GBP', 'JPY', 'BRL'];
    const rows = products.map((product) => [
      `"${sanitizeHtml(product.name, { allowedTags: [] }).replace(/"/g, '""')}"`, // Escape quotes in CSV
      product.price,
      product.expiration,
      product.exchangeRates.USD.toFixed(2),
      product.exchangeRates.EUR.toFixed(2),
      product.exchangeRates.GBP.toFixed(2),
      product.exchangeRates.JPY.toFixed(2),
      product.exchangeRates.BRL.toFixed(2),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `products_page_${page}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div>
      {allErrors.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-red-600">Errors in Upload</h2>
          <ul className="list-disc pl-5">
            {allErrors.map((error, index) => (
              <li key={index} className="text-sm text-red-500">
                Line {error.line}: {error.error}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex justify-end mb-4">
        <Button onClick={exportToCsv}>
          Export to CSV
        </Button>
      </div>
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
              <TableCell>
                <span
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(product.name, {
                      allowedTags: [],
                      allowedAttributes: {},
                    }),
                  }}
                />
              </TableCell>
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