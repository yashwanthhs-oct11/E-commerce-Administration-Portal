import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './pages/Admin/Products/ProductsList';
import ProductUpdate from './pages/Admin/Products/ProductUpdate';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/update/:id" element={<ProductUpdate />} />
            </Routes>
        </Router>
    );
};

export default App;
