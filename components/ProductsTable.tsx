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
    fetchAllUploadStatuses,
    fetchProducts,
    setNameFilter,
    setPriceFilter,
    setExpirationFilter,
    setSort,
    setLimit,
  } = useAppStore();

  const [localNameFilter, setLocalNameFilter] = useState(nameFilter);
  const [localPriceFilter, setLocalPriceFilter] = useState(priceFilter);
  const [localExpirationFilter, setLocalExpirationFilter] = useState(expirationFilter);

  useEffect(() => {
    if (jobIds.length > 0) {
      fetchAllUploadStatuses();
      fetchProducts();
    }
  }, [jobIds, page, limit, fetchAllUploadStatuses, fetchProducts]);

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
    setTimeout(() => storeSetter(value), 300); // Debounce de 300ms
  };

  const handleSort = (column: 'name' | 'price' | 'expiration') => {
    const newOrder = sortBy === column && order === 'ASC' ? 'DESC' : 'ASC';
    setSort(column, newOrder);
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
      <div className="flex justify-between mb-4 flex-wrap gap-4">
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Filter by name..."
            value={localNameFilter}
            onChange={(e) => handleFilterChange(setLocalNameFilter, e.target.value, setNameFilter)}
            className="border border-gray-300 rounded p-2 text-sm w-40"
          />
          <input
            type="number"
            placeholder="Filter by price..."
            value={localPriceFilter}
            onChange={(e) => handleFilterChange(setLocalPriceFilter, e.target.value, setPriceFilter)}
            className="border border-gray-300 rounded p-2 text-sm w-32"
          />
          <input
            type="date"
            placeholder="Filter by expiration..."
            value={localExpirationFilter}
            onChange={(e) => handleFilterChange(setLocalExpirationFilter, e.target.value, setExpirationFilter)}
            className="border border-gray-300 rounded p-2 text-sm w-40"
          />
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border border-gray-300 rounded p-2 text-sm"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
        <Button onClick={exportToCsv}>Export to CSV</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
              Name {sortBy === 'name' && (order === 'ASC' ? '↑' : '↓')}
            </TableHead>
            <TableHead onClick={() => handleSort('price')} className="cursor-pointer">
              Price {sortBy === 'price' && (order === 'ASC' ? '↑' : '↓')}
            </TableHead>
            <TableHead onClick={() => handleSort('expiration')} className="cursor-pointer">
              Expiration {sortBy === 'expiration' && (order === 'ASC' ? '↑' : '↓')}
            </TableHead>
            <TableHead>USD</TableHead>
            <TableHead>EUR</TableHead>
            <TableHead>GBP</TableHead>
            <TableHead>JPY</TableHead>
            <TableHead>BRL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : products.length > 0 ? (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(product.name, { allowedTags: [], allowedAttributes: {} }),
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
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No products to display
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between">
        <Button onClick={() => fetchProducts({ page: page - 1 })} disabled={page === 1 || isLoading}>
          Previous
        </Button>
        <span>Page {page} of {totalPages}</span>
        <Button onClick={() => fetchProducts({ page: page + 1 })} disabled={page === totalPages || isLoading}>
          Next
        </Button>
      </div>
    </div>
  );
}