import React, { useState, useEffect } from 'react';

interface LoadingCountdownProps {
    frequency: number;
    onComplete?: () => void;
    startTime?: number;
    isPaused: boolean;
    onPauseToggle: () => void;
}

const LoadingCountdown: React.FC<LoadingCountdownProps> = ({ 
    frequency,
    onComplete,
    startTime = Date.now(),
    isPaused,
    onPauseToggle
}) => {
    useEffect(() => {
        const fill = document.querySelector('.countdown-fill') as HTMLElement;
        const loadbar = document.querySelector('.loading-countdown') as HTMLElement;
        if (fill) {
            if (isPaused) {
                // Set solid grey fill when paused
                fill.style.transition = 'none';
                fill.style.transform = 'scaleX(1)';
                fill.style.backgroundColor = '#a5a5a5';
                fill.style.backgroundImage = 'linear-gradient(rgb(255, 25, 25), rgb(255, 99, 99) 40%, rgb(255,125,125) 50%, rgb(255, 99, 99) 60%, rgb(255, 25, 25))';
                loadbar.style.filter = 'drop-shadow(0px 0px 4px #ff0000)';
            } else {
                // Reset to normal animation state
                fill.style.backgroundColor = 'var(--accent-color)';
                fill.style.transition = `transform ${frequency}s linear`;
                fill.style.transform = 'scaleX(0)';
                fill.style.backgroundImage = 'linear-gradient(rgb(89, 255, 47), rgb(132, 255, 101) 40%, rgb(132, 255, 101) 60%, rgb(89, 255, 47))';
                loadbar.style.filter = 'drop-shadow(0px 0px 4px var(--accent-color))';
                
                const animate = () => {
                    fill.style.transition = 'transform 0.2s linear';
                    fill.style.transform = 'scaleX(1)';
                    
                    setTimeout(() => {
                        fill.style.transition = `transform ${frequency}s linear`;
                        fill.style.transform = 'scaleX(0)';
                        if (onComplete) {
                            setTimeout(onComplete, frequency * 1000);
                        }
                    }, 200);
                };

                animate();
                const interval = setInterval(animate, frequency * 1000);
                return () => clearInterval(interval);
            }
        }
    }, [frequency, startTime, isPaused]);

    return (
        <div 
            className="loading-countdown"
            onClick={onPauseToggle}
            style={{ cursor: 'pointer' }}
        >
            <div className="countdown-fill" />
        </div>
    );
};

export default LoadingCountdown;