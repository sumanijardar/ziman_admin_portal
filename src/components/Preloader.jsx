import React, { useEffect, useState } from 'react';

const Preloader = () => {
    const [visible, setVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Start fading out after 200ms
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, 200);

        // Remove from DOM after fade-out transition completes (takes 500ms)
        const removeTimer = setTimeout(() => {
            setVisible(false);
        }, 700);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    if (!visible) return null;

    return (
        <div 
            id="preloader" 
            style={{
                transition: 'opacity 0.5s ease',
                opacity: fadeOut ? 0 : 1,
                pointerEvents: 'none'
            }}
        >
            <div className="loader">
                <svg className="circular" viewBox="25 25 50 50">
                    <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="3" strokeMiterlimit="10" />
                </svg>
            </div>
        </div>
    );
};

export default Preloader;
