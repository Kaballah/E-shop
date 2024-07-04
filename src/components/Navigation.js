import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import '../styles/Navigation.scss';

const Navigation = () => {
    return (
        <nav className="navigation">
            <div className="nav-left">
                <h1>E-shop</h1>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/contact">Contact Us</Link></li>
                    <li>
                        Category
                        <ul className="dropdown">
                            <li>Computer and Accessories</li>
                            <li>Home Appliances</li>
                            <li>Home and Kitchen</li>
                            <li>Electronic Devices</li>
                            <li>Shoes</li>
                            <li>Phones and Accessories</li>
                            <li>Health and Beauty</li>
                            <li>Bags</li>
                            <li>Clothes</li>
                            <li>Jewelry</li>
                            <li>Others</li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div className="nav-right">

                <div className="search-container">
                    <FaSearch className="search-icon" />
                    <div className="separator"></div>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search"
                    />
                    <div className="placeholder-text">Search</div>
                </div>

                {/* <input type="text" placeholder="Search..." /> */}
                <Link to="/cart">
                    <FaShoppingCart /> Cart
                </Link>
                <Link to="/login">
                    <button>Login</button>
                </Link>
            </div>
        </nav>
    );
}

export default Navigation;
