'use client';

import { useEffect, useState } from 'react';
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
import { Product } from '@/types';

export function ProductsTable() {
  const {
    jobIds,
    products,
    uploadStatuses,
    page,
    limit,
    totalPages,
    nameFilter,
    priceFilter,
    expirationFilter,
    sortBy,
    order,
    isLoading,
    shouldFetchStatuses,
    fetchAllUploadStatuses,
    fetchProducts,
    setNameFilter,
    setPriceFilter,
    setExpirationFilter,
    setSort,
    setLimit,
    clearUploadStatuses,
  } = useAppStore();

  const [localNameFilter, setLocalNameFilter] = useState(nameFilter);
  const [localPriceFilter, setLocalPriceFilter] = useState(priceFilter);
  const [localExpirationFilter, setLocalExpirationFilter] = useState(expirationFilter);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchProducts(); 
  }, [fetchProducts]);

  useEffect(() => {
    if (jobIds.length > 0 && shouldFetchStatuses) {
      fetchAllUploadStatuses();
    }
  }, [jobIds, shouldFetchStatuses, fetchAllUploadStatuses]);

  const allErrors = Object.values(uploadStatuses)
    .filter((status) => status?.errors && status.errors.length > 0)
    .flatMap((status) => status.errors || []);

  const exportToCsv = () => {
    const headers = ['Name', 'Price', 'Expiration', 'USD', 'EUR', 'GBP', 'JPY', 'BRL'];
    const rows = products.map((product) => [
      `"${sanitizeHtml(product.name, { allowedTags: [] }).replace(/"/g, '""')}"`,
      product.price,
      product.expiration,
      product.exchangeRates.USD.toFixed(2),
      product.exchangeRates.EUR.toFixed(2),
      product.exchangeRates.GBP.toFixed(2),
      product.exchangeRates.JPY.toFixed(2),
      product.exchangeRates.BRL.toFixed(2),
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `products_page_${page}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleFilterChange = (
    setter: (value: string) => void,
    value: string,
    storeSetter: (value: string) => void
  ) => {
    setter(value);
    setTimeout(() => {
      clearUploadStatuses();
      storeSetter(value);
    }, 300);
  };

  const handleSort = (column: 'name' | 'price' | 'expiration') => {
    const newOrder = sortBy === column && order === 'ASC' ? 'DESC' : 'ASC';
    clearUploadStatuses();
    setSort(column, newOrder);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && !isLoading) {
      setIsTransitioning(true);
      setTimeout(() => {
        clearUploadStatuses();
        fetchProducts({ page: newPage });
        setIsTransitioning(false);
      }, 800); 
    }
  };

  if (!isMounted) return null;

  return (
    <div>
      {allErrors.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
            Errors in Upload
          </h2>
          <ul className="list-disc pl-5">
            {allErrors.map((error, index) => (
              <li key={index} className="text-sm text-red-500 dark:text-red-300">
                Line {error.line}: {error.error}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex justify-between mb-4 flex-wrap gap-4">
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Filter by name..."
            value={localNameFilter}
            onChange={(e) => handleFilterChange(setLocalNameFilter, e.target.value, setNameFilter)}
            className="border border-gray-300 rounded p-2 text-sm w-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          />
          <input
            type="number"
            placeholder="Filter by price..."
            value={localPriceFilter}
            onChange={(e) => handleFilterChange(setLocalPriceFilter, e.target.value, setPriceFilter)}
            className="border border-gray-300 rounded p-2 text-sm w-32 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          />
          <input
            type="date"
            placeholder="Filter by expiration..."
            value={localExpirationFilter}
            onChange={(e) => handleFilterChange(setLocalExpirationFilter, e.target.value, setExpirationFilter)}
            className="border border-gray-300 rounded p-2 text-sm w-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          />
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border border-gray-300 rounded p-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
        <Button onClick={exportToCsv}>Export to CSV</Button>
      </div>
      <div className={`transition-opacity duration-800 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('name')} className="cursor-pointer dark:text-gray-300">
                Name {sortBy === 'name' && (order === 'ASC' ? '↑' : '↓')}
              </TableHead>
              <TableHead onClick={() => handleSort('price')} className="cursor-pointer dark:text-gray-300">
                Price {sortBy === 'price' && (order === 'ASC' ? '↑' : '↓')}
              </TableHead>
              <TableHead onClick={() => handleSort('expiration')} className="cursor-pointer dark:text-gray-300">
                Expiration {sortBy === 'expiration' && (order === 'ASC' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="dark:text-gray-300">USD</TableHead>
              <TableHead className="dark:text-gray-300">EUR</TableHead>
              <TableHead className="dark:text-gray-300">GBP</TableHead>
              <TableHead className="dark:text-gray-300">JPY</TableHead>
              <TableHead className="dark:text-gray-300">BRL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center dark:text-gray-300">
                  Loading...
                </TableCell>
              </TableRow>
            ) : visibleProducts.length > 0 ? (
              visibleProducts.map((product, index) => (
                <TableRow
                  key={product.id}
                  className="transition-opacity duration-500 ease-in-out"
                  style={{
                    animation: 'fadeInUp 0.5s ease-in-out',
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both',
                  }}
                >
                  <TableCell className="dark:text-gray-200">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(product.name, { allowedTags: [], allowedAttributes: {} }),
                      }}
                    />
                  </TableCell>
                  <TableCell className="dark:text-gray-200">{product.price}</TableCell>
                  <TableCell className="dark:text-gray-200">{product.expiration}</TableCell>
                  <TableCell className="dark:text-gray-200">{product.exchangeRates.USD.toFixed(2)}</TableCell>
                  <TableCell className="dark:text-gray-200">{product.exchangeRates.EUR.toFixed(2)}</TableCell>
                  <TableCell className="dark:text-gray-200">{product.exchangeRates.GBP.toFixed(2)}</TableCell>
                  <TableCell className="dark:text-gray-200">{product.exchangeRates.JPY.toFixed(2)}</TableCell>
                  <TableCell className="dark:text-gray-200">{product.exchangeRates.BRL.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center dark:text-gray-300">
                  No products to display
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex justify-between">
        <Button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1 || isLoading}
          className={isTransitioning ? 'opacity-50' : 'opacity-100'}
        >
          Previous
        </Button>
        <span className="dark:text-gray-300">Page {page} of {totalPages}</span>
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages || isLoading}
          className={isTransitioning ? 'opacity-50' : 'opacity-100'}
        >
          Next
        </Button>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}