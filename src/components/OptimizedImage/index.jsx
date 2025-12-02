import React, { useState } from 'react';
import './styles.scss';

const OptimizedImage = ({ 
    src, 
    alt = '', 
    className = '', 
    lazy = true,
    width,
    height,
    onClick,
    ...props 
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
        setIsLoaded(true);
    };

    return (
        <div className={`optimized-image-wrapper ${className}`}>
            {!isLoaded && !hasError && (
                <div className="image-placeholder">
                    <div className="spinner"></div>
                </div>
            )}
            {hasError ? (
                <div className="image-error">
                    <span>Image non disponible</span>
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    loading={lazy ? "lazy" : "eager"}
                    decoding="async"
                    width={width}
                    height={height}
                    onLoad={handleLoad}
                    onError={handleError}
                    onClick={onClick}
                    className={`optimized-image ${isLoaded ? 'loaded' : ''}`}
                    {...props}
                />
            )}
        </div>
    );
};

export default OptimizedImage;
