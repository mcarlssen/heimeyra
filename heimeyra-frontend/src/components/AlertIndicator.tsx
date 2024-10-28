import React, { useState, useEffect } from 'react';

const AlertIndicator: React.FC<{ distance: number }> = ({ distance }) => {
    const [alertLevel, setAlertLevel] = useState("off");

    useEffect(() => {
        if (distance < 1.5) setAlertLevel("red flashing");
        else if (distance < 2) setAlertLevel("red");
        else if (distance < 3) setAlertLevel("amber");
        else setAlertLevel("off");
    }, [distance]);

    return (
        <div className={`alert-indicator ${alertLevel}`}>
            <img src={`/${alertLevel}.png`} alt="Alert Indicator" />
        </div>
    );
};

export default AlertIndicator;
