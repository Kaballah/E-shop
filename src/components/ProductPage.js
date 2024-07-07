import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProductPage.scss';

const ProductPage = ({ match }) => {
    const [product, setProduct] = useState({});
    const [similarProducts, setSimilarProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');

    const { id } = useParams();

    useEffect(() => {
        const fetchProductDetails = async () => {
            const response = await axios.get(`http://localhost/ecommerce-api/getProductDetails.php?product_id=${id}`);
            setProduct(response.data);
            setSelectedImage(`http://localhost/ecommerce-api${response.data.image}`);
        };

        const fetchSimilarProducts = async () => {
            const response = await axios.get(`http://localhost/ecommerce-api/getSimilarProducts.php?category=${product.category}&sub_category=${product.sub_category}`);
            setSimilarProducts(response.data);
        };

        const fetchReviews = async () => {
            const response = await axios.get(`http://localhost/ecommerce-api/getReviews.php?product_id=${id}`);
            setReviews(response.data);
        };

        fetchProductDetails();
        fetchSimilarProducts();
        fetchReviews();
    }, [id, product.category, product.sub_category]);

    return (
        <div className="product-page">
            <nav>
                <a href="/">Home</a> / 
                <a href={`/category/${product.category}`}>{product.category}</a> / 
                <a href={`/category/${product.category}/${product.sub_category}`}>{product.sub_category}</a> / 
                {product.name}
            </nav>
            <div className="product-details">
                <div className="image-gallery">
                    {[product.image, product.image1, product.image2, product.image3, product.image4, product.image5].map((image, index) => (
                        image && <img key={index} src={`http://localhost/ecommerce-api${image}`} alt={`Thumbnail ${index + 1}`} onClick={() => setSelectedImage(`http://localhost/ecommerce-api${image}`)} />
                    ))}
                </div>
                <div className="selected-image">
                    <img src={selectedImage} alt="Selected Product" />
                </div>
                <div className="product-info">
                    <h1>{product.name}</h1>
                    <p>{product.description}</p>
                    <p>Category: {product.category}</p>
                    <p>Price: ${product.price}</p>
                </div>
            </div>
            <div className="similar-products">
                <h2>Similar Products</h2>
                <div className="products-slider">
                    {similarProducts.map(similarProduct => (
                        <div className="product" key={similarProduct.id}>
                            <img src={`http://localhost/ecommerce-api${similarProduct.image}`} alt={similarProduct.name} />
                            <p>{similarProduct.name}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="reviews-section">
                <div className="general-overview">
                    <h2>Reviews</h2>
                    <div className="rating-stars">
                        {/* Add logic for displaying rating stars */}
                    </div>
                </div>
                <div className="written-reviews">
                    {/* {reviews.map(review => (
                        <div className="review" key={review.id}>
                            <p>{review.review_text}</p>
                            <p><strong>{review.user_name}</strong> - {new Date(review.review_date).toLocaleDateString()}</p>
                        </div>
                    ))} */}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
