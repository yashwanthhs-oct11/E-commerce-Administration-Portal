// src/pages/Admin/Products/CreateProduct.jsx
import React, { useState, useEffect } from 'react';
import API from '../../../utils/api';
import { useNavigate } from 'react-router-dom';

function CreateProduct() {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        countInStock: '',
        image: '',
    });
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await API.get('/categories');
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories', error);
            }
        };

        fetchCategories();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            for (const key in product) {
                formData.append(key, product[key]);
            }
            await API.post('/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/admin/products');
        } catch (error) {
            console.error('Error creating product', error);
        }
    };

    const handleImageChange = (e) => {
        setProduct({ ...product, image: e.target.files[0] });
    };

    return (
        <form onSubmit={handleCreate}>
            <h2 className="text-xl mb-4">Create Product</h2>
            <input
                type="text"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                placeholder="Product Name"
                required
                className="border p-2 mb-2 w-full"
            />
            <textarea
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                placeholder="Description"
                required
                className="border p-2 mb-2 w-full"
            />
            <input
                type="number"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                placeholder="Price"
                required
                className="border p-2 mb-2 w-full"
            />
            <select
                value={product.category}
                onChange={(e) => setProduct({ ...product, category: e.target.value })}
                required
                className="border p-2 mb-2 w-full"
            >
                <option value="">Select Category</option>
                {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
            </select>
            <input
                type="number"
                value={product.countInStock}
                onChange={(e) => setProduct({ ...product, countInStock: e.target.value })}
                placeholder="Count In Stock"
                required
                className="border p-2 mb-2 w-full"
            />
            <input
                type="file"
                onChange={handleImageChange}
                required
                className="border p-2 mb-2 w-full"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create</button>
        </form>
    );
}

export default CreateProduct;
