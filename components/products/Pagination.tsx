'use client';

import { Button } from '@/components/ui/button';

interface PaginationProps {
  page: number;
  totalPages: number;
  isLoading: boolean;
  isTransitioning: boolean;
  handlePageChange: (newPage: number) => void;
}

export function Pagination({ page, totalPages, isLoading, isTransitioning, handlePageChange }: PaginationProps) {
  return (
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
  );
}