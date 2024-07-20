import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const postRating = async (productId, userId, rating, title, text) => {
    try {
        const response = await fetch('http://localhost/path_to_your_api/api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId,
                userId,
                rating,
                title,
                text
            })
        });

        const data = await response.json();
        if (data.success) {
            console.log("Rating posted successfully!");
            // Optionally, refetch reviews to update the UI
        } else {
            console.error("Error posting rating:", data.error);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
};

// const handleSubmit = async (e) => {
//     e.preventDefault();
//     await postRating(productId, userId, rating, title, text);
//     // Optionally refetch reviews to update the UI
// };

const WriteReview = ({ productId, userId }) => {
    const [rating, setRating] = useState(0);
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewText, setReviewText] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost/ecommerce-api/addReview.php', {
                product_id: productId,
                rating,
                review_title: reviewTitle,
                review_text: reviewText,
            });
            navigate(`/product/${productId}`);
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    return (
        <div className="write-review">
            <h2>Write a Review</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Rating</label>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Review</label>
                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit">Submit Review</button>
            </form>
        </div>
    );
};

export default WriteReview;
