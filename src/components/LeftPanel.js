import React from 'react';
import '../styles/LeftPanel.scss';
import { Link } from 'react-router-dom';

const LeftPanel = ({ recentlyViewedItems = [] }) => {
  return (
    <div className="left-panel">
      <div className="recently-viewed">
        <h2>Recently Viewed Items</h2>
        {recentlyViewedItems.length === 0 ? (
            <p>No recently viewed items.</p>
        ) : (
            recentlyViewedItems.map(item => (
                <div className="recent-item" key={item.id}>
                    <Link to={`/product/${item.id}`} className='link'>
                        <img src={`http://localhost/ecommerce-api/${item.image}`} alt={item.name} />
                        <p>{item.name}</p>
                    </Link>
                </div>
            ))
        )}
      </div>
      <div className="subscribe">
        <h2>Become a Subscriber</h2>
        <input type="email" placeholder="Enter your email" />
        <button>Subscribe</button>
      </div>
      <div className="follow-us">
        <h2>Follow Us</h2>
        <div className="icons">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">X</a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
