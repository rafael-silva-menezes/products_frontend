# CSV Upload Frontend (React/Next.js)

This is the frontend application for the CSV Upload project, built with React and Next.js. It provides a user interface for uploading CSV files containing product data, processing them, and displaying the results in a paginated table with filtering and sorting capabilities. The application is designed to be robust, user-friendly, and scalable, with a focus on modern development practices.

## Getting Started

### Prerequisites
- **Node.js**: Version 18.x or higher (recommended: 20.x for Next.js 15 compatibility).
- **npm**: Version 8.x or higher (or use `yarn` if preferred).
- **Backend API**: Ensure the backend is running at `http://localhost:8000` (default) or configure the `NEXT_PUBLIC_API_URL` environment variable.

### Installation
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd products_frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Environment Variables** (optional):
   - Create a `.env.local` file in the root directory if the backend URL differs from the default:
     ```
     NEXT_PUBLIC_API_URL=http://your-backend-url
     ```

### Running the Application
1. **Development Mode**:
   ```bash
   npm run dev
   ```
   - Opens the app at `http://localhost:3000` with hot reloading.

2. **Build and Run Production**:
   ```bash
   npm run build
   npm start
   ```
   - Builds the app and serves it at `http://localhost:3000`.

### Running Tests
- **Run All Tests**:
  ```bash
  npm run test
  ```
  - Executes unit and integration tests using Jest and React Testing Library.
- **Verbose Output**:
  ```bash
  npm run test -- --verbose
  ```

## Features and Implementation

### What We Built
This frontend application fulfills the core requirements of uploading a CSV file, processing it, and displaying the results. Key features include:

- **CSV Upload**: Users can upload CSV files via a form (`UploadForm.tsx`) with client-side validation for type (`.csv`) and size (< 1GB).
- **Progress Feedback**: Displays granular progress messages ("Sending to server...", "Processing data...", "Saving to database...") during upload and processing.
- **Result Display**: Shows processed data in a paginated table (`ProductsTable.tsx`) with columns `name`, `price`, `expiration`, and `exchangeRates` (USD, EUR, GBP, JPY, BRL).
- **State Management**: Centralized state management using Zustand (`store.ts`) for `jobIds`, `products`, and `uploadStatuses`.
- **Pagination**: Supports server-side pagination with 10, 20, 50, or 100 items per page, including navigation controls.
- **Filtering and Sorting**: Allows filtering by `name`, `price`, and `expiration`, with debounced input (300ms) and sortable columns.
- **Export**: Exports the current table page to CSV via a button in `ProductsTable.tsx`.
- **Theme Support**: Light/dark mode toggle using `next-themes`, with consistent styling across components.

### Technologies Used
- **React/Next.js**: Framework for building the UI and handling server-side rendering (Next.js 15.2).
- **TypeScript**: Strong typing with interfaces defined in `types/index.ts` (e.g., `Product`, `UploadStatus`).
- **Zustand**: Lightweight state management for global state, with persistence for `jobIds` in `localStorage`.
- **Tailwind CSS**: Utility-first CSS framework for styling, enhanced with `globals.css` for dark mode support.
- **Shadcn-UI**: Reusable UI components (`button.tsx`, `table.tsx`) integrated with Tailwind.
- **Axios**: HTTP client for API calls (`api.ts`), configured with a 60s timeout.
- **Sanitize-HTML**: Protection against XSS in `ProductsTable.tsx` for rendering `name`.
- **React Testing Library**: Unit and integration tests for components and hooks.
- **Jest**: Test runner for executing tests, configured with JSDOM.

### Improvements Implemented
- **Code Organization**: Separated logic into custom hooks (`useUpload.ts`, `useProductTable.ts`) and API calls into `api.ts`, improving modularity.
- **Component Refactoring**: Split `ProductsTable.tsx` into smaller components (`Filters.tsx`, `Pagination.tsx`) for better maintainability and testability.
- **Robust Error Handling**: Client-side file validation, XSS protection, and timeout handling for uploads.
- **UI/UX Enhancements**: Granular progress messages, dark mode support, and error persistence fixes (cleared on interaction or reload).
- **Testing**: Implemented 6 unit tests (`UploadForm.test.tsx`, `ProductsTable.test.tsx`, `Filters.test.tsx`, `Pagination.test.tsx`, `useUpload.test.tsx`, `useProductTable.test.tsx`) and 1 integration test (`integration.test.tsx`), covering core functionality and edge cases.
- **Bug Fixes**: Resolved infinite loop in `ProductsTable.tsx` (adjusted `useEffect`) and persistent errors (cleared dynamically).

## Future Improvements
While the current implementation meets the core requirements and includes several enhancements, there are opportunities for further improvement:
- **Real-Time Progress**: Replace polling in `useUpload.ts` with WebSocket for incremental progress updates (requires backend support).
- **Chunked Uploads**: Implement upload in chunks for large files (e.g., 900MB, 205k+ lines) to improve performance and avoid timeouts (requires backend endpoint).
- **API Mocking with MSW**: Add Mock Service Worker for offline testing and more robust test scenarios.
- **Virtualization**: Integrate `react-virtuoso` or `@tanstack/react-virtual` for rendering large datasets (200k+ lines) efficiently, once UI stability is confirmed.
- **React Query**: Replace Zustand with `react-query` for caching and optimized data fetching.
- **Charts**: Add a price visualization component using `Chart.js` in `ProductsTable.tsx`.
- **Upload History**: Display past uploads using persisted `jobIds` in a new page.
- **Internationalization**: Implement `next-intl` for multi-language support.

## Notes
- The backend is assumed to be running at `http://localhost:8000`. Adjust `NEXT_PUBLIC_API_URL` if different.
- Tests assume a clean state; ensure no external API calls interfere during `npm run test`.
- Current pagination handles up to 100 items per page; virtualization is recommended for larger datasets.

This project demonstrates a balance of functionality, robustness, and modern development practices, with a solid foundation for future enhancements.
