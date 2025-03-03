'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import sanitizeHtml from 'sanitize-html';
import { useProductTable } from '@/lib/hooks/useProductTable';
import { Filters } from './Filters';
import { Pagination } from './Pagination';

export function ProductsTable() {
  const {
    products,
    allErrors,
    page,
    limit,
    totalPages,
    isLoading,
    isTransitioning,
    localNameFilter,
    localPriceFilter,
    localExpirationFilter,
    sortBy,
    order,
    setLocalNameFilter,
    setLocalPriceFilter,
    setLocalExpirationFilter,
    handleSort,
    handlePageChange,
    setLimit,
  } = useProductTable();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

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

  return (
    <div>
      {allErrors.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Errors in Upload</h2>
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
        <Filters
          localNameFilter={localNameFilter}
          localPriceFilter={localPriceFilter}
          localExpirationFilter={localExpirationFilter}
          setLocalNameFilter={setLocalNameFilter}
          setLocalPriceFilter={setLocalPriceFilter}
          setLocalExpirationFilter={setLocalExpirationFilter}
          limit={limit}
          setLimit={setLimit}
        />
        <Button onClick={exportToCsv}>Export to CSV</Button>
      </div>
      <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
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
            ) : products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
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
      <Pagination
        page={page}
        totalPages={totalPages}
        isLoading={isLoading}
        isTransitioning={isTransitioning}
        handlePageChange={handlePageChange}
      />
    </div>
  );
}