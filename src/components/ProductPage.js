import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProductPage.scss';
import { handleProductClick, useRecentlyViewed } from './HandleProductClick.js';
import Modal from './Modal.js';
import Footer from './Footer.js';

const ProductPage = () => {
    const [category, setCategory] = useState({});
    const [product, setProduct] = useState({});
    const [similarProducts, setSimilarProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(null);
    const [recentlyViewed, setRecentlyViewed] = useRecentlyViewed();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { id } = useParams();
    const productsSliderRef = useRef(null);
    const [transitioning, setTransitioning] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const productResponse = await axios.get(`http://localhost/ecommerce-api/getProductDetails.php?product_id=${id}`);
                const productData = productResponse.data;
                setProduct(productData);
                setSelectedImage(`http://localhost/ecommerce-api${productData.image}`);

                const categoryResponse = await axios.get(`http://localhost/ecommerce-api/getCategories.php?category_id=${productData.category_id}`);
                setCategory(categoryResponse.data);

                if (productData.category_id) {
                    const similarProductsResponse = await axios.get(`http://localhost/ecommerce-api/getSimilarProducts.php?category_id=${productData.category_id}&id=${id}`);
                    setSimilarProducts(similarProductsResponse.data);
                }

                const reviewsResponse = await axios.get(`http://localhost/ecommerce-api/getReviews.php?product_id=${id}`);
                setReviews(reviewsResponse.data);
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };

        fetchProductDetails();
    }, [id]);

    const handleStarClick = (star) => {
        setRating(star);
        fetch(`http://localhost/ecommerce-api/save-review.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: id, rating: star })
        })
        .then(response => response.json())
        .then(data => {
            setReviews([...reviews, data]);
        })
        .catch(err => console.error(err));
    };

    // Function to handle click on image preview
    const handleClickImage = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal
    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    const getStarColor = (index) => {
        if (hoveredStar !== null) {
            return index < hoveredStar ? 'orange' : 'grey';
        }
        return index < rating ? 'orange' : 'grey';
    };

    const handleNavigation = (direction) => {
        if (productsSliderRef.current && !transitioning) {
            setTransitioning(true);
            const productWidth = productsSliderRef.current.firstChild.clientWidth;
            productsSliderRef.current.style.transition = 'transform 0.5s ease';

            if (direction === 'left') {
                productsSliderRef.current.style.transform = `translateX(${productWidth}px)`;
            } else {
                productsSliderRef.current.style.transform = `translateX(-${productWidth}px)`;
            }

            setTimeout(() => {
                productsSliderRef.current.style.transition = 'none';
                productsSliderRef.current.style.transform = 'translateX(0)';
                const newSimilarProducts = [...similarProducts];
                if (direction === 'left') {
                    newSimilarProducts.unshift(newSimilarProducts.pop());
                } else {
                    newSimilarProducts.push(newSimilarProducts.shift());
                }
                setSimilarProducts(newSimilarProducts);
                setTransitioning(false);
            }, 500);
        }
    };

    return (
        <div>
            <div className="product-page">
                <nav>
                    <Link to="/">Home</Link> / 
                    <Link to={`/category/${category.category_name}`}>{category.category_name}</Link> / 
                    <Link to={`/category/${category.category_name}/${category.sub_category_name}`}>{category.sub_category_name}</Link> / 
                    {product.name}
                </nav>
                <div className="product-details">
                    <div className="image-gallery">
                        {[product.image, product.image1, product.image2, product.image3, product.image4, product.image5].map((image, index) => (
                            image && <img key={index} src={`http://localhost/ecommerce-api${image}`} alt={`Thumbnail ${index + 1}`} onClick={() => setSelectedImage(`http://localhost/ecommerce-api${image}`)} />
                        ))}
                    </div>

                    <Modal imageUrl={selectedImage} isOpen={isModalOpen} onClose={handleCloseModal} />
                    <div className="selected-image">
                        <img src={selectedImage} alt="Selected Product" onClick={handleClickImage} />
                    </div>

                    <div className="product-info">
                        <h1>{product.name}</h1>
                        <p>{product.description}</p>
                        <p>Category: {category.category_name}</p>
                        <p>Price: ${product.price}</p>
                        <p>Brand: {product.brand}</p>
                    </div>
                </div>

                <div className="similar-products">
                    <h2>Similar Products</h2>
                    <div>
                        <div ref={productsSliderRef} className='products-slider'>
                            {similarProducts.slice(0, 5).map(similarProduct => (
                                <Link to={`/product/${similarProduct.id}`} className='link' onClick={() => handleProductClick(similarProduct, recentlyViewed, setRecentlyViewed)} >
                                    <div className="product" key={similarProduct.id} >
                                        <img src={`http://localhost/ecommerce-api${similarProduct.image}`} alt={similarProduct.name} />
                                        <div className="product-title" data-full-title={similarProduct.name}>
                                            {similarProduct.name}
                                        </div>
                                        {/* <p>{similarProduct.name}</p> */}
                                    </div>
                                </Link>
                            ))}
                        </div>
                        {similarProducts.length > 5 && (
                            <div className='nav'>
                                <button className="carousel-nav left" onClick={() => handleNavigation('left')}>{'<'}</button>
                                <button className="carousel-nav right" onClick={() => handleNavigation('right')}>{'>'}</button>
                            </div>
                        )}
                    </div>
                    {/* {similarProducts.length > 5 && (
                        <>
                            <button className="carousel-nav left" onClick={() => handleNavigation('left')}>{'<'}</button>
                            <button className="carousel-nav right" onClick={() => handleNavigation('right')}>{'>'}</button>
                        </>
                    )} */}
                </div>

                <div className="reviews-section">
                    <div className="general-overview" style={{ width: '25%' }}>
                        <h2>Reviews</h2>
                        <div className="rating-stars">
                            {[1, 2, 3, 4, 5].map((star, index) => (
                                <span
                                    key={index}
                                    style={{ color: getStarColor(index) }}
                                    onMouseEnter={() => setHoveredStar(index + 1)}
                                    onMouseLeave={() => setHoveredStar(null)}
                                    onClick={() => handleStarClick(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <p>{rating} / 5</p>
                    </div>
                    <div className="written-reviews" style={{ width: '75%' }}>
                        {reviews.length > 0 ? reviews.map(review => (
                            <div className="review" key={review.id}>
                                <p>{review.review_text}</p>
                                <p><strong>{review.user_name}</strong> - {new Date(review.review_date).toLocaleDateString()}</p>
                            </div>
                        )) : <p>No reviews available.</p>}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductPage;
