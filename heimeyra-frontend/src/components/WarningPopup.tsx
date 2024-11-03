import React from 'react';

interface WarningPopupProps {
    distance: number;
    userRadius: number;
}

const WarningPopup: React.FC<WarningPopupProps> = ({ distance, userRadius }) => {
    console.log('WarningPopup rendering with:', { distance, userRadius });
    const getIndicatorStates = () => {
        const statuteDistance = distance * 1.15078;
        const radiusFraction = statuteDistance / userRadius;
        const states = radiusFraction <= 1.25 ? ['red', 'red'] :
                      radiusFraction <= 1.75 ? ['yellow', 'red'] :
                      radiusFraction <= 2.5 ? ['yellow', 'yellow'] :
                      radiusFraction <= 3.5 ? ['gray', 'yellow'] :
                      ['gray', 'gray'];
        console.log('Indicator states calculated:', states);
        return states;
    };

    const [indicator1, indicator2] = getIndicatorStates();
    console.log('Final indicator states:', { indicator1, indicator2 });

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