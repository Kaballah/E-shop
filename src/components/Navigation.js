import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { faLaptop, faHome, faUtensils, faMobileAlt, faShoePrints, faHeartbeat, faBriefcase, faTshirt, faGem, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/Navigation.scss';

const Navigation = () => {
    return (
        <nav className="navigation">
            <div className="nav-left">
                <h1>E-shop</h1>
                <ul>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" to="/">Home</NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" to="/about">About Us</NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" to="/contact">Contact Us</NavLink>
                    </li>

                    <li className="nav-item category nav-link-category">
                        Category
                        
                        <ul className="dropdown">
                            {/* <li>Computer and Accessories</li>
                            <li>Home Appliances</li>
                            <li>Home and Kitchen</li>
                            <li>Electronic Devices</li>
                            <li>Shoes</li>
                            <li>Phones and Accessories</li>
                            <li>Health and Beauty</li>
                            <li>Bags</li>
                            <li>Clothes</li>
                            <li>Jewelry</li>
                            <li>Others</li> */}

                            <li className="dropdown-item">
                                <FontAwesomeIcon icon={faLaptop} className="dropdown-icon" />
                                <NavLink to="/category/computer" className="dropdown-link">Computer and Accessories</NavLink>
                            </li>
                            <li className="dropdown-item">
                                <FontAwesomeIcon icon={faHome} className="dropdown-icon" />
                                <NavLink to="/category/appliances" className="dropdown-link">Home Appliances</NavLink>
                            </li>
                            <li className="dropdown-item">
                                <FontAwesomeIcon icon={faUtensils} className="dropdown-icon" />
                                <NavLink to="/category/kitchen" className="dropdown-link">Home and Kitchen</NavLink>
                            </li>
                            <li className="dropdown-item">
                                <FontAwesomeIcon icon={faMobileAlt} className="dropdown-icon" />
                                <NavLink to="/category/electronics" className="dropdown-link">Electronic Devices</NavLink>
                            </li>
                            <li className="dropdown-item">
                                <FontAwesomeIcon icon={faShoePrints} className="dropdown-icon" />
                                <NavLink to="/category/shoes" className="dropdown-link">Shoes</NavLink>
                            </li>
                            <li className="dropdown-item">
                                <FontAwesomeIcon icon={faMobileAlt} className="dropdown-icon" />
                                <NavLink to="/category/phones" className="dropdown-link">Phones and Accessories</NavLink>
                            </li>
                            <li className="dropdown-item">
                                <FontAwesomeIcon icon={faHeartbeat} className="dropdown-icon" />
                                <NavLink to="/category/health" className="dropdown-link">Health and Beauty</NavLink>
                            </li>
                            <li className="dropdown-item">
                                <FontAwesomeIcon icon={faBriefcase} className="dropdown-icon" />
                                <NavLink to="/category/bags" className="dropdown-link">Bags</NavLink>
                            </li>
                            <li className="dropdown-item">
                                <FontAwesomeIcon icon={faTshirt} className="dropdown-icon" />
                                <NavLink to="/category/clothes" className="dropdown-link">Clothes</NavLink>
                            </li>
                            <li className="dropdown-item">
                                <FontAwesomeIcon icon={faGem} className="dropdown-icon" />
                                <NavLink to="/category/jewelry" className="dropdown-link">Jewelry</NavLink>
                            </li>
                            <li className="dropdown-item">
                                <FontAwesomeIcon icon={faEllipsisH} className="dropdown-icon" />
                                <NavLink to="/category/others" className="dropdown-link">Others</NavLink>
                            </li>
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

                <NavLink to="/cart">
                    <button className="btn cart-button">
                        {/* <FontAwesomeIcon icon={faShoppingCart} /> Cart */}
                        <svg>
                            <rect x="0" y="0" fill="none" width="100%" height="100%"/>
                        </svg>

                        Cart
                    </button>
                </NavLink>

                <NavLink to="/login">
                    <button className="btn login-button">
                        {/* <FontAwesomeIcon icon={faUser} /> Login */}

                        <svg>
                            <rect x="0" y="0" fill="none" width="100%" height="100%"/>
                        </svg>

                        Login
                    </button>
                </NavLink>
            </div>
        </nav>
    );
}

export default Navigation;
