import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProductPage.scss';

const ProductPage = ({ match }) => {
    const [category, setCategory] = useState([]);
    const [product, setProduct] = useState({});
    const [similarProducts, setSimilarProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');

    const { id } = useParams();

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const productResponse = await axios.get(`http://localhost/ecommerce-api/getProductDetails.php?product_id=${id}`);
                const productData = productResponse.data;
                setProduct(productData);
                setSelectedImage(`http://localhost/ecommerce-api${productData.image}`);
                
                const categoryResponse = await axios.get(`http://localhost/ecommerce-api/getCategories.php?category_id=${productData.category_id}`);
                setCategory(categoryResponse.data);
                
                if (product.category_id) {
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
    }, [id, product.category_id]);

    return (
        <div className="product-page">
            <nav>
                <a href="/">Home</a> / 
                <a href={`/category/${category.category_name}`}>{category.category_name}</a> / 
                <a href={`/category/${category.category_name}/${category.sub_category_name}`}>{category.sub_category_name}</a> / 
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
                    <p>Category: {category.category_name}</p>
                    <p>Price: ${product.price}</p>
                </div>
            </div>

            <div className="similar-products">
                <h2>Similar Products</h2>
                <div className="products-slider">
                    {similarProducts.length > 0 ? similarProducts.map(similarProduct => (
                        <div className="product" key={similarProduct.id}>
                            <img src={`http://localhost/ecommerce-api${similarProduct.image}`} alt={similarProduct.name} />
                            <p>{similarProduct.name}</p>
                        </div>
                    )) : <p>No similar products found.</p>}
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
                    {reviews.length > 0 ? reviews.map(reviews => (
                        <div className="review" key={reviews.id}>
                            <p>{reviews.review_text}</p>
                            <p><strong>{reviews.user_name}</strong> - {new Date(reviews.review_date).toLocaleDateString()}</p>
                        </div>
                    )) : <p>No reviews available.</p>}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
