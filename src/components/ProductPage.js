import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProductPage.scss';
import { handleProductClick, useRecentlyViewed } from './HandleProductClick.js';
// import Rating from 'react-rating';
import ProductRating from './ProductRating.js';
import ReviewSection from './ReviewSection.js';
import Modal from './Modal.js';
import Footer from './Footer.js';

const ProductPage = () => {
    const [category, setCategory] = useState({});
    const [product, setProduct] = useState({});
    const [description, setDescription] = useState([]);
    const [itemsRemaining, setItemsRemaining] = useState(product.items_remaining);
    const [cartQuantity, setCartQuantity] = useState(0);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [rating, setRating] = useState(0);
    const [ratingBreakdown, setRatingBreakdown] = useState({});
    // const [hoveredStar, setHoveredStar] = useState(null);
    const [recentlyViewed, setRecentlyViewed] = useRecentlyViewed();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState('top');
    const { id } = useParams();
    const productsSliderRef = useRef(null);
    const [transitioning, setTransitioning] = useState(false);
    const navigate = useNavigate();
    const [userRatings, setUserRatings] = useState({});

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

                // const reviewCountsResponse = await axios.get(`http://localhost/ecommerce-api/getReviewCounts.php?product_id=${id}`);
                // const reviewCountsData = reviewCountsResponse.data;
                // setReviews(prevReviews => prevReviews.map(review => {
                //     const countData = reviewCountsData.find(count => count.id === review.id);
                //     return {
                //         ...review,
                //         helpful: countData ? countData.helpful : 0,
                //         report: countData ? countData.report : 0,
                //     };
                // }));

                const ratingResponse = await axios.get(`http://localhost/ecommerce-api/getProductRating.php?product_id=${id}`);
                setRating(ratingResponse.data.rating);

                const ratingBreakdownResponse = await axios.get(`http://localhost/ecommerce-api/getRatingBreakdown.php?product_id=${id}`);
                setRatingBreakdown(ratingBreakdownResponse.data);
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };

        fetchProductDetails();

        const fetchReviewCounts = async () => {
            try {
                const response = await axios.get(`http://localhost/ecommerce-api/getReviewCounts.php?product_id=${id}`);
                const data = response.data;
        
                const updatedReviews = reviews.map(review => {
                    const reviewData = data.find(r => r.id === review.id);
                    return { ...review, helpful: reviewData.helpful, report: reviewData.report };
                });
                
                setReviews(updatedReviews);
            } catch (error) {
                console.error("Error fetching review counts:", error);
            }
        };

        fetchReviewCounts();

        const savedUserRatings = localStorage.getItem('userRatings');
        if (savedUserRatings) {
            setUserRatings(JSON.parse(savedUserRatings));
        }
    }, [id, reviews]);

    useEffect(() => {
        axios.get(`/getProductDescription.php?product_id=${product.id}`)
            .then(response => {
                const descriptionList = response.data.description.split('\n').map((item, index) => (
                    <li key={index}>{item.replace('• ', '')}</li>
                ));
                setDescription(descriptionList);
            })
            .catch(error => console.error('Error fetching product description:', error));
    }, [product.id]);



    // Function to handle click on image preview
    const handleClickImage = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal
    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    const addToCart = () => {
        setCartQuantity(cartQuantity + 1);
        setItemsRemaining(itemsRemaining - 1);
    };

    const removeFromCart = () => {
        if (cartQuantity > 0) {
            setCartQuantity(cartQuantity - 1);
            setItemsRemaining(itemsRemaining + 1);
        }
    };

    const getStarColor = (index, rating) => {
        // setRating(rating);
        return index < rating ? 'orange' : 'grey';
    };

    // const handleThumbClick = (reviewId, type) => {
    //     setReviews(prevReviews => {
    //         const updatedReviews = prevReviews.map(review => {
    //             if (review.id === reviewId) {
    //                 const userRating = userRatings[reviewId] || null;

    //                 if (type === 'helpful') {
    //                     if (userRating === 'helpful') {
    //                         review.helpful -= 1;
    //                         setUserRatings(prev => ({ ...prev, [reviewId]: null }));
    //                     } else {
    //                         if (userRating === 'report') {
    //                             review.report -= 1;
    //                         }
    //                         review.helpful += 1;
    //                         setUserRatings(prev => ({ ...prev, [reviewId]: 'helpful' }));
    //                     }
    //                 } else {
    //                     if (userRating === 'report') {
    //                         review.report -= 1;
    //                         setUserRatings(prev => ({ ...prev, [reviewId]: null }));
    //                     } else {
    //                         if (userRating === 'helpful') {
    //                             review.helpful -= 1;
    //                         }
    //                         review.report += 1;
    //                         setUserRatings(prev => ({ ...prev, [reviewId]: 'report' }));
    //                     }
    //                 }
    //             }
    //             return review;
    //         });
    //         return updatedReviews;
    //     });
    // };

    const handleThumbClick = async (reviewId, type) => {
        const userId = 1; // Replace with actual user ID
    
        try {
            const userRating = userRatings[reviewId] || null;
            const action = userRating === type ? 'decrement' : 'increment';
    
            const response = await axios.post('http://localhost/ecommerce-api/updateReviewCount.php', {
                review_id: reviewId,
                type: type,
                action: action,
                user_id: userId
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.data.message === "Review count updated successfully.") {
                setReviews(prevReviews => {
                    return prevReviews.map(review => {
                        if (review.id === reviewId) {
                            const element = document.getElementById(`review-${reviewId}-${type}`);
                            element.classList.remove("animate");
                            void element.offsetWidth; // Trigger reflow
                            element.classList.add("animate");

                            if (type === 'helpful') {
                                review.helpful += (action === 'increment' ? 1 : (review.helpful > 0 ? -1 : 0));
                                if (userRating === 'report') {
                                    review.report -= (review.report > 0 ? 1 : 0);
                                }
                                setUserRatings(prev => ({ ...prev, [reviewId]: action === 'increment' ? 'helpful' : null }));
                            } else {
                                review.report += (action === 'increment' ? 1 : (review.report > 0 ? -1 : 0));
                                if (userRating === 'helpful') {
                                    review.helpful -= (review.helpful > 0 ? 1 : 0);
                                }
                                setUserRatings(prev => ({ ...prev, [reviewId]: action === 'increment' ? 'report' : null }));
                            }
                        }
                        return review;
                    });
                });

                localStorage.setItem('userRatings', JSON.stringify(userRatings));
            } else {
                console.error("Failed to update review count.");
            }
        } catch (error) {
            console.error("Error updating review count:", error);
        }
    };

    const sortedReviews = reviews.sort((a, b) => {
        if (sortOrder === 'top') {
            return b.helpful - a.helpful;
        } else {
            return new Date(b.review_date) - new Date(a.review_date);
        }
    });

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

                        <div className="product-details">
                            <a href="#rating-section" className="product-rating-link">
                                {product.rating} Stars
                            </a>

                            <a href="#w" className="product-brand-link">
                                {product.brand}
                            </a>

                            <span className="items-remaining">
                                {itemsRemaining} items remaining
                            </span>
                        </div>

                        <hr className="separator" />

                        <h2>Description</h2>

                        <ul className="product-description">
                            {product.description}
                        </ul>

                        <button 
                            className="add-to-cart-button" 
                            onClick={addToCart} 
                            disabled={itemsRemaining === 0}
                        >
                            {cartQuantity === 0 ? 'Add to Cart' : (
                                <>
                                    <button className="cart-quantity-btn" onClick={removeFromCart}>-</button>
                                    {cartQuantity}
                                    <button className="cart-quantity-btn" onClick={addToCart}>+</button>
                                </>
                            )}
                        </button>

                        {/* <p>{product.description}</p>

                        <p>Category: {category.category_name}</p>
                        <p>Price: ${product.price}</p>
                        <p>Brand: {product.brand}</p> */}
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
                    <div className="general-overview" style={{ width: '30%' }}>
                        <h2>Customer Review</h2>
                        <div className="rating-stars">

                        <ProductRating/>

                            {/* {rating % 1 !== 0 && (
                                <span style={{ color: 'orange' }}>★</span>
                            )}
                            {rating % 1 === 0 && (
                                <span style={{ color: 'grey' }}>★</span>
                            )} */}
                        </div>

                        {/* <p>{rating} out of 5.0</p> */}

                        <div className="rating-breakdown">
                            {[5, 4, 3, 2, 1].map(star => {
                                // const count = reviews.filter(review => review.rating === star).length;
                                // const percentage = (count / reviews.length) * 100;

                                const count = ratingBreakdown[star] || 0;
                                const percentage = (count / reviews.length) * 100;
                                return (
                                    <div key={star} className="rating-bar">
                                        <span>{star} stars</span>
                                        <div className="bar">
                                            <div className="filled-bar" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                        <span>{percentage.toFixed(0)}%</span>
                                    </div>
                                );
                            })}
                        </div>

                        <button onClick={() => navigate('/writeReview')}>Write a Review</button>
                    </div>
                    
                    <div className="written-reviews" style={{ width: '65%' }}>
                        <div className="sorting">
                            <button onClick={() => setSortOrder('top')}>Top Reviews</button>
                            <button onClick={() => setSortOrder('recent')}>Recent Reviews</button>
                        </div>
                        {sortedReviews.length > 0 ? sortedReviews.map(review => (
                        <div className="review" key={review.id}>
                            <div className="avatar">A</div>

                            <div className="review-content">
                                <div className="review-header">
                                    <span className="review-name">{review.user_name}</span>
                                    <span className="review-rating">
                                        {[1, 2, 3, 4, 5].map((star, index) => (
                                            <span
                                                key={index}
                                                style={{ color: getStarColor(index, review.rating) }}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </span>
                                    <span className="review-title"><b>{review.review_title}</b></span>
                                    <span className="review-date" style={{ color: 'grey' }}>{new Date(review.review_date).toLocaleDateString()}</span>
                                </div>
                                <p>{review.review_text}</p>
                                <div className="review-actions">
                                    {/* <button 
                                        className={`thumbs-up ${userRatings[review.id] === 'helpful' ? 'active' : ''}`}
                                        onClick={() => handleThumbClick(review.id, 'helpful')}
                                    >
                                        👍 <span className="count">{review.helpful}</span>
                                    </button>
                                    <span className="separator"></span>
                                    <button 
                                        className={`thumbs-down ${userRatings[review.id] === 'report' ? 'active' : ''}`}
                                        onClick={() => handleThumbClick(review.id, 'report')}
                                    >
                                        👎 <span className="count">{review.report}</span>
                                    </button> */}

                                    <button onClick={() => handleThumbClick(review.id, 'helpful')}>
                                        <span id={`review-${review.id}-helpful`}>{review.helpful}</span> 👍
                                    </button>
                                    <button onClick={() => handleThumbClick(review.id, 'report')}>
                                        <span id={`review-${review.id}-report`}>{review.report}</span> 👎
                                    </button>
                                </div>
                            </div>
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
