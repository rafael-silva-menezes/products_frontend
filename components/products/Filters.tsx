'use client';


interface FiltersProps {
  localNameFilter: string;
  localPriceFilter: string;
  localExpirationFilter: string;
  setLocalNameFilter: (value: string) => void;
  setLocalPriceFilter: (value: string) => void;
  setLocalExpirationFilter: (value: string) => void;
  limit: number;
  setLimit: (limit: number) => void;
}

export function Filters({
  localNameFilter,
  localPriceFilter,
  localExpirationFilter,
  setLocalNameFilter,
  setLocalPriceFilter,
  setLocalExpirationFilter,
  limit,
  setLimit,
}: FiltersProps) {
  return (
    <div className="flex gap-4 flex-wrap">
      <input
        type="text"
        placeholder="Filter by name..."
        value={localNameFilter}
        onChange={(e) => setLocalNameFilter(e.target.value)}
        className="border border-gray-300 rounded p-2 text-sm w-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
      />
      <input
        type="number"
        placeholder="Filter by price..."
        value={localPriceFilter}
        onChange={(e) => setLocalPriceFilter(e.target.value)}
        className="border border-gray-300 rounded p-2 text-sm w-32 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
      />
      <input
        type="date"
        placeholder="Filter by expiration..."
        value={localExpirationFilter}
        onChange={(e) => setLocalExpirationFilter(e.target.value)}
        className="border border-gray-300 rounded p-2 text-sm w-40 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200"
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
  );
}