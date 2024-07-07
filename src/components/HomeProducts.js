import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/HomeProducts.scss';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost/ecommerce-api/fetch-products.php')
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    return (
        <div className="products-page">
            <h2>Products</h2>
            <div className="products-grid">
                {products.map(product => (
                    <div className="product" key={product.id}>
                        <img src={product.image} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>${product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductsPage;
