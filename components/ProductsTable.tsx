'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '../lib/api';
import { Product } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ProductsTableProps {
  jobId: string;
}

export function ProductsTable({ jobId }: ProductsTableProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await getProducts({ page: 1, limit: 10 });
        setProducts(data);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [jobId]);

  if (isLoading) return <p className="text-gray-500">Carregando produtos...</p>;

  return (
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
  );
}