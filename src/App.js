import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import CartPage from './components/CartPage';
import ProductsPage from './components/ProductsPage';
import './styles/App.scss';

const App = () => {
    return (
        <Router>
            <div className="app">
                <Navigation />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
