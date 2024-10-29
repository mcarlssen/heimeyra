import React from 'react';

interface WarningIndicatorsProps {
    distance: number;
}

const WarningIndicators: React.FC<WarningIndicatorsProps> = ({ distance }) => {
    const getIndicatorStates = () => {
        if (distance <= 1.5) return ['red', 'red'];
        if (distance <= 3) return ['yellow', 'gray'];
        return ['gray', 'gray'];
    };

    const [indicator1, indicator2] = getIndicatorStates();

    return (
        <div className="warning-indicators">
            <div className={`indicator ${indicator1}`} />
            <div className={`indicator ${indicator2}`} />
        </div>
    );
};

export default WarningIndicators;
