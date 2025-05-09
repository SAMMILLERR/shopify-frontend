/* App.js */
import React, { useEffect, useState } from 'react';
import { fetchProducts, addProduct, searchProducts } from './api';
import './App.css';

function AddProductForm({ onAdd }) {
  const [form, setForm] = useState({ name: '', price: '', description: '', image_url: '' });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await onAdd(form);
    setForm({ name: '', price: '', description: '', image_url: '' });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="price" type="number" placeholder="Price (₹)" value={form.price} onChange={handleChange} required />
      <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input name="image_url" placeholder="Image URL" value={form.image_url} onChange={handleChange} />
      <button type="submit">Add Product</button>
    </form>
  );
}

function SearchBar({ value, onSearch, onClear, loading }) {
  return (
    <div className="search-bar">
      <input
        placeholder="Search products..."
        value={value}
        onChange={e => onSearch(e.target.value)}
      />
      {value && <button onClick={onClear}>Clear</button>}
      {loading && <span className="loading">Loading...</span>}
    </div>
  );
}

function ProductItem({ product }) {
  return (
    <li className="product-item">
      {product.image_url && (
        <img src={product.image_url} alt={product.name} className="product-image" />
      )}
      <div className="product-details">
        <h3>{product.name}</h3>
        <p className="price">₹{parseFloat(product.price).toFixed(2)}</p>
        <p className="description">{product.description}</p>
      </div>
    </li>
  );
}

function ProductList({ products }) {
  if (!products.length) return <p>No products found.</p>;
  return (
    <ul className="product-list">
      {products.map(p => <ProductItem key={p.id} product={p} />)}
    </ul>
  );
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await fetchProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleSearch = async term => {
    setSearch(term);
    if (!term.trim()) return loadProducts();
    setLoading(true);
    const data = await searchProducts(term);
    setProducts(data);
    setLoading(false);
  };

  const handleAdd = async product => {
    setLoading(true);
    await addProduct(product);
    await loadProducts();
  };

  return (
    <div className="container">
      <header>
        <h1>🛍️ Product Catalog</h1>
      </header>

      <section className="controls">
        <div className="panel">
          <h2>Add Product</h2>
          <AddProductForm onAdd={handleAdd} />
        </div>

        <div className="panel">
          <h2>Search Products</h2>
          <SearchBar
            value={search}
            onSearch={handleSearch}
            onClear={() => handleSearch('')}
            loading={loading}
          />
        </div>
      </section>

      <section>
        <h2>Products</h2>
        <ProductList products={products} />
      </section>
    </div>
  );
}

