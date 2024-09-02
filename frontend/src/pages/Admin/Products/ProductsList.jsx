import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3000/products/${id}`)
            .then(response => {
                setProducts(products.filter(product => product._id !== id));
            })
            .catch(error => console.error('Error deleting product:', error));
    };

    return (
        <div>
            <h1>Product List</h1>
            <ul>
                {products.map(product => (
                    <li key={product._id}>
                        <h2>{product.name}</h2>
                        <img src={product.image} alt={product.name} width="100" />
                        <p>{product.description}</p>
                        <button onClick={() => handleDelete(product._id)}>Delete</button>
                        <a href={`/update/${product._id}`}>Update</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
