// src/pages/Customer/MyOrders.jsx
import React, { useState, useEffect } from 'react';
import API from '../../utils/api';

function MyOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await API.get('/orders/get/userorders/{userid}');
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div>
            <h1 className="text-2xl mb-4">My Orders</h1>
            <ul>
                {orders.map(order => (
                    <li key={order._id} className="mb-4">
                        <div className="p-4 border">
                            <h2 className="text-xl">Order ID: {order._id}</h2>
                            <p>Status: {order.status}</p>
                            <p>Total: ${order.totalPrice}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MyOrders;
