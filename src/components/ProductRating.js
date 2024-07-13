// import React from 'react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Rating from 'react-rating';
// import SVGIcon from 'react-dom'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faStar, faStar as faStarEmpty } from '@fortawesome/free-solid-svg-icons';
import { FaStar, FaStar as FaStarEmpty } from 'react-icons/fa';

// import { fa-star-o } from '@fortawesome/react-fontawesome'

const ProductRating = () => {

    let [rating, setRating] = useState(0);
    const { id } = useParams();

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const ratingResponse = await axios.get(`http://localhost/ecommerce-api/getProductRating.php?product_id=${id}`);
                setRating(ratingResponse.data.rating);
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };

        fetchProductDetails();
    }, [id, setRating]);

    // const getStarColor = (index, rating) => {
    //     // setRating(rating);
    //     return index < rating ? 'orange' : 'grey';
    // };

    if (typeof rating !== 'number') {
        rating = parseFloat(rating); // Attempt to parse as float
    }

    return (
        <div className="product-rating">
            <Rating
                count={5}
                initialRating={rating}
                fractions={2}
                size={24}
                readonly
                isHalf={true} // Enable half star increments
                activeColor="#f09819"

                // emptySymbol={ <FontAwesomeIcon icon={faStarEmpty} className="fa-2x" /> }
                // fullSymbol={<FontAwesomeIcon icon={faStar} className="fa-2x"/>}

                emptySymbol={<FaStar color={ "grey"} />}
                fullSymbol={<FaStarEmpty color={"orange"} />}
            />
            <p>{rating.toFixed(1)} out of 5.0</p>
        </div>
    );
};

export default ProductRating;
