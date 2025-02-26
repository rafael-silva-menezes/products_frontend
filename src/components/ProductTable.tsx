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

  // Atualiza produtos quando initialProducts muda (após upload)
  useEffect(() => {
    setProducts(initialProducts);
    console.log('Initial products updated:', initialProducts.length);
  }, [initialProducts]);

  const fetchProducts = async (name: string, sort: string, order: string) => {
    try {
      const params = {
        name: name || undefined,
        sortBy: sort,
        order: order,
      };
      const response = await axios.get('http://localhost:8000/products', { params });
      setProducts(response.data);
      console.log('Products fetched:', response.data.length);
    } catch (error: any) {
      console.error('Error fetching products:', error.response?.data?.message || error.message);
    }
  };

  const handleFilterChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = e.target.value;
    setFilterName(newFilter);
    if (newFilter) await fetchProducts(newFilter, sortBy, sortOrder); // Só busca se há filtro
  };

  const handleSortChange = async (field: string) => {
    const newSortOrder = sortBy === field && sortOrder === 'ASC' ? 'DESC' : 'ASC';
    setSortBy(field);
    setSortOrder(newSortOrder);
    await fetchProducts(filterName, field, newSortOrder);
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
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.expiration}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No products to display</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;