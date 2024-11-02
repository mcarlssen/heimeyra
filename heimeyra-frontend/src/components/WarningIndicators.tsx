import React, { useState, useEffect } from 'react';

interface WarningIndicatorsProps {
    distance: number;
    userRadius: number;
}

const WarningIndicators: React.FC<WarningIndicatorsProps> = ({ distance, userRadius }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [popupWindow, setPopupWindow] = useState<Window | null>(null);

    const getIndicatorStates = () => {
        const statuteDistance = distance * 1.15078;
        const radiusFraction = statuteDistance / userRadius;

        if (radiusFraction <= 1.25) return ['red', 'red'];
        if (radiusFraction <= 1.75) return ['yellow', 'red'];
        if (radiusFraction <= 2.5) return ['yellow', 'yellow'];
        if (radiusFraction <= 3.5) return ['gray', 'yellow'];
        return ['gray', 'gray'];
    };

    const tooltipContent = `
        Red-Red: aircraft within ${(userRadius * 1.25).toFixed(1)} miles
        Yellow-Red: aircraft within ${(userRadius * 1.75).toFixed(1)} miles
        Yellow-Yellow: aircraft within ${(userRadius * 2.5).toFixed(1)} miles
        Gray-Yellow: aircraft within ${(userRadius * 3.5).toFixed(1)} miles
    `;

    const [indicator1, indicator2] = getIndicatorStates();

    const openPopup = () => {
        const popup = window.open('warning-popup.html', 'WarningIndicators',
            'width=210,height=80,resizable=yes,frame=false,titlebar=false,toolbar=false'
        );
        
        if (popup) {
            setPopupWindow(popup);
            
            // Send data to popup
            popup.addEventListener('load', () => {
                popup.postMessage({ 
                    type: 'UPDATE_WARNINGS',
                    distance,
                    userRadius
                }, '*');
            });
        }
    };

    // Update popup when values change
    useEffect(() => {
        if (popupWindow) {
            popupWindow.postMessage({ 
                type: 'UPDATE_WARNINGS',
                distance,
                userRadius
            }, '*');
        }
    }, [distance, userRadius, popupWindow]);

    return (
        <div 
            className="warning-indicators"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <button 
                className="popup-button" 
                onClick={openPopup}
                title="Open in separate window"
            >
                ⇱
            </button>
            <div className={`indicator ${indicator1}`} />
            <div className={`indicator ${indicator2}`} />
            {showTooltip && (
                <div className="warning-tooltip">
                    {tooltipContent.split('\n').map((line, i) => (
                        <div key={i}>{line.trim()}</div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default WarningIndicators;
