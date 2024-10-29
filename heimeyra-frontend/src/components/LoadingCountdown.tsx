import React, { useState, useEffect } from 'react';

interface LoadingCountdownProps {
    frequency: number;
    onComplete?: () => void;  // Add callback for completion
    startTime?: number;       // Add trigger for animation start
}

const LoadingCountdown: React.FC<LoadingCountdownProps> = ({ 
    frequency,
    onComplete,
    startTime = Date.now()
}) => {
    useEffect(() => {
        const fill = document.querySelector('.countdown-fill') as HTMLElement;
        if (fill) {
            fill.style.transition = `transform ${frequency}s linear`;
            fill.style.transform = 'scaleX(0)';
            
            const animate = () => {
                // Quick refill
                fill.style.transition = 'transform 0.2s linear';
                fill.style.transform = 'scaleX(1)';
                
                // Start countdown after refill
                setTimeout(() => {
                    fill.style.transition = `transform ${frequency}s linear`;
                    fill.style.transform = 'scaleX(0)';
                    if (onComplete) {
                        setTimeout(onComplete, frequency * 1000);
                    }
                }, 200); // Match the refill transition duration
            };

            animate();
            const interval = setInterval(animate, frequency * 1000);
            return () => clearInterval(interval);
        }
    }, [frequency, startTime]); // Add startTime to dependencies

    return (
        <div className="loading-countdown">
            <div className="countdown-fill" />
        </div>
    );
};

export default LoadingCountdown;
