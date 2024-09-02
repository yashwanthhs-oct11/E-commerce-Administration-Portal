import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProductUpdate = () => {
    const [product, setProduct] = useState({});
    const [image, setImage] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3000/products/${id}`)
            .then(response => {
                setProduct(response.data);
            })
            .catch(error => console.error('Error fetching product:', error));
    }, [id]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('price', product.price);
        formData.append('category', product.category);
        formData.append('image', image);

        axios.put(`http://localhost:3000/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(() => {
                navigate('/');
            })
            .catch(error => console.error('Error updating product:', error));
    };

    return (
        <div>
            <h1>Update Product</h1>
            <form onSubmit={handleSubmit}>
                <label>Name:
                    <input type="text" name="name" value={product.name || ''} onChange={handleChange} />
                </label>
                <label>Description:
                    <input type="text" name="description" value={product.description || ''} onChange={handleChange} />
                </label>
                <label>Price:
                    <input type="number" name="price" value={product.price || ''} onChange={handleChange} />
                </label>
                <label>Category:
                    <input type="text" name="category" value={product.category || ''} onChange={handleChange} />
                </label>
                <label>Image:
                    <input type="file" name="image" onChange={handleImageChange} />
                </label>
                <button type="submit">Update Product</button>
            </form>
        </div>
    );
};

export default ProductUpdate;
