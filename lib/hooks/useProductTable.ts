'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '../store';

export function useProductTable() {
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

  useEffect(() => {
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
      }, 300);
    }
  };

  return {
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
    setLocalNameFilter: (value: string) => handleFilterChange(setLocalNameFilter, value, setNameFilter),
    setLocalPriceFilter: (value: string) => handleFilterChange(setLocalPriceFilter, value, setPriceFilter),
    setLocalExpirationFilter: (value: string) => handleFilterChange(setLocalExpirationFilter, value, setExpirationFilter),
    handleSort,
    handlePageChange,
    setLimit,
  };
}