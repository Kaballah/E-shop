import React from 'react';
import '../styles/Modal.scss';

const Modal = ({ imageUrl, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>X</span>
                <img src={imageUrl} alt="Full Size Product" />
                {/* <button onClick={onClose}>Close</button> */}
            </div>
        </div>
    );
};

export default Modal;