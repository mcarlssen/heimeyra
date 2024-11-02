import React, { useEffect } from 'react';

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
                fill.style.backgroundColor = '#666';
                fill.style.transition = 'none';
                fill.style.transform = 'scaleX(1)';
                loadbar.style.filter = 'drop-shadow(0px 0px 8px #ff0000)';
            } else {
                // Reset to normal animation state
                fill.style.backgroundColor = '#666';
                fill.style.transition = `transform ${frequency}s linear`;
                fill.style.transform = 'scaleX(0)';
                loadbar.style.filter = 'drop-shadow(0px 0px 8px #2cff00)';
                
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