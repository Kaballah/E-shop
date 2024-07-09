import { useState, useEffect } from 'react';

const useRecentlyViewed = () => {
    const [recentlyViewed, setRecentlyViewed] = useState([]);

    useEffect(() => {
        const storedRecentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
        setRecentlyViewed(storedRecentlyViewed);
    }, []);

    return [recentlyViewed, setRecentlyViewed];
};

const handleProductClick = (product, recentlyViewed, setRecentlyViewed) => {
    const updatedRecentlyViewed = [...recentlyViewed];
    if (!updatedRecentlyViewed.find(item => item.id === product.id)) {
        updatedRecentlyViewed.unshift(product);
        if (updatedRecentlyViewed.length > 5) {
            updatedRecentlyViewed.pop();
        }
        setRecentlyViewed(updatedRecentlyViewed);
        localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed));
    }
};

export { useRecentlyViewed, handleProductClick };