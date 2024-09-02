// src/pages/Customer/Shop.jsx
import React, { useState, useEffect } from 'react';
import API from '../../utils/api';

function Store() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await API.get('/products');
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <h1 className="text-2xl mb-4">Store</h1>
            <ul className="grid grid-cols-3 gap-4">
                {products.map(product => (
                    <li key={product._id} className="p-4 border">
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-2" />
                        <h2 className="text-xl">{product.name}</h2>
                        <p>${product.price}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Store;
