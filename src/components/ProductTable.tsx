import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  price: number;
  expiration: string;
  exchangeRates: { [key: string]: number };
}

interface ProductTableProps {
  products: Product[];
}

const ProductTable: React.FC<ProductTableProps> = ({ products: initialProducts }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filterName, setFilterName] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<string>('ASC');

  // Fetch products when filter or sort changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {
          name: filterName || undefined, // Omit if empty
          sortBy,
          order: sortOrder,
        };
        const response = await axios.get('http://localhost:8000/products', { params });
        setProducts(response.data);
        console.log('Products fetched:', response.data.length); // Log number of products fetched
      } catch (error: any) {
        console.error('Error fetching products:', error.response?.data?.message || error.message);
      }
    };

    fetchProducts();
  }, [filterName, sortBy, sortOrder]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(e.target.value);
  };

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      // Toggle order if clicking the same field
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      // Set new sort field and default to ASC
      setSortBy(field);
      setSortOrder('ASC');
    }
  };

  return (
    <div className="product-table">
      <div className="controls">
        <input
          type="text"
          placeholder="Filter by name..."
          value={filterName}
          onChange={handleFilterChange}
        />
        <div className="sort-buttons">
          <button onClick={() => handleSortChange('name')}>
            Name {sortBy === 'name' ? (sortOrder === 'ASC' ? '↑' : '↓') : ''}
          </button>
          <button onClick={() => handleSortChange('price')}>
            Price {sortBy === 'price' ? (sortOrder === 'ASC' ? '↑' : '↓') : ''}
          </button>
          <button onClick={() => handleSortChange('expiration')}>
            Expiration {sortBy === 'expiration' ? (sortOrder === 'ASC' ? '↑' : '↓') : ''}
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Expiration</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.expiration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;