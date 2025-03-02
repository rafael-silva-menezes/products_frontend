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
  const { jobId, products, uploadStatus, page, totalPages, fetchProducts } = useAppStore();

  useEffect(() => {
    if (jobId) {
      fetchProducts(page);
    }
  }, [jobId, page, fetchProducts]);

  const handlePrevious = () => {
    if (page > 1) fetchProducts(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) fetchProducts(page + 1);
  };

  if (!jobId) return null;

  return (
    <div>
      {uploadStatus && uploadStatus.errors && uploadStatus.errors.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-red-600">Erros no Upload</h2>
          <ul className="list-disc pl-5">
            {uploadStatus.errors.map((error, index) => (
              <li key={index} className="text-sm text-red-500">
                Linha {error.line}: {error.error}
              </li>
            ))}
          </ul>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Expiração</TableHead>
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
        <Button onClick={handlePrevious} disabled={page === 1}>
          Anterior
        </Button>
        <span>Página {page} de {totalPages}</span>
        <Button onClick={handleNext} disabled={page === totalPages}>
          Próximo
        </Button>
      </div>
    </div>
  );
}