import React from 'react';

interface WarningPopupProps {
    distance: number;
    userRadius: number;
}

const WarningPopup: React.FC<WarningPopupProps> = ({ distance, userRadius }) => {
    const getIndicatorStates = () => {
        const statuteDistance = distance * 1.15078;
        const radiusFraction = statuteDistance / userRadius;

        if (radiusFraction <= 1.25) return ['red', 'red'];
        if (radiusFraction <= 1.75) return ['yellow', 'red'];
        if (radiusFraction <= 2.5) return ['yellow', 'yellow'];
        if (radiusFraction <= 3.5) return ['gray', 'yellow'];
        return ['gray', 'gray'];
    };

    const [indicator1, indicator2] = getIndicatorStates();

    return (
        <div className="warning-popup">
            <div className="close-button" onClick={() => window.close()}>×</div>
            <div className="warning-indicators">
                <div className={`indicator ${indicator1}`} />
                <div className={`indicator ${indicator2}`} />
            </div>
        </div>
    );
};

export default WarningPopup;