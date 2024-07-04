import React, { useState, useEffect, useRef } from 'react';
import '../styles/HomePage.scss';

import image1 from "../img/image1.jpg";
import image2 from "../img/image2.jpg";
import image3 from "../img/image3.jpg";
import image4 from "../img/image4.jpg";
import image5 from "../img/image5.jpg";

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const carouselRef = useRef(null);

    useEffect(() => {
        fetch('http://localhost/ecommerce-api/fetch-products.php')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(err => setError(err));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prevSlide => (prevSlide + 1) % 5);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (carouselRef.current) {
            carouselRef.current.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
    }, [currentSlide]);

    const handleProductClick = (product) => {
        const updatedRecentlyViewed = [...recentlyViewed];
        if (!updatedRecentlyViewed.find(item => item.id === product.id)) {
            updatedRecentlyViewed.unshift(product);
            if (updatedRecentlyViewed.length > 5) {
                updatedRecentlyViewed.pop();
            }
            setRecentlyViewed(updatedRecentlyViewed);
        }
    };

    return (
        <div className="home-page">
            <div className="content">
                <div className="primary-content">
                    <div className="banner-carousel">
                    <div className="carousel-inner" ref={carouselRef}>
                            <img src={image1} alt="Banner 1" />
                            <img src={image2} alt="Banner 2" />
                            <img src={image3} alt="Banner 3" />
                            <img src={image4} alt="Banner 4" />
                            <img src={image5} alt="Banner 5" />
                        </div>
                    </div>

                    <div className="frequently-viewed-items">
                        <h2>Frequently Viewed Items</h2>
                        {error ? (
                            <div className="error">Error: {error}</div>
                        ) : (
                            <div className="items-grid">
                                {products.map(product => (
                                    <div 
                                        className="item" 
                                        key={product.id}
                                        onClick={() => handleProductClick(product)}
                                    >
                                        <img src={`http://localhost/ecommerce-api/${product.image}`} alt={product.name} />
                                        <h3>{product.name}</h3>
                                        <p>Ksh. {product.price}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                </div>

                <div className="secondary-content">
                    <div className="recently-viewed-items container">
                        <h2>Recently Viewed</h2>
                        {recentlyViewed.length === 0 ? (
                            <p>No recently viewed items.</p>
                        ) : (
                            recentlyViewed.map(item => (
                                <div className="recent-item" key={item.id}>
                                    <img src={`http://localhost/ecommerce-api/${item.image}`} alt={item.name} />
                                    <p>{item.name}</p>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="subscriber-section container">
                        <h2>Become a Subscriber</h2>
                        <input type="email" placeholder="Enter your email" />
                        <button>Subscribe</button>
                    </div>

                    <div className="social-media container">
                        <h2>Follow Us</h2>
                        <a href="https://instagram.com">Instagram</a>
                        <a href="https://twitter.com">X</a>
                        <a href="https://facebook.com">Facebook</a>
                        <a href="https://linkedin.com">LinkedIn</a>
                    </div>
                </div>
            </div>

            <footer>
                <p>© 2024 E-shop. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default HomePage;
