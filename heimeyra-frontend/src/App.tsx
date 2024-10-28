import React, { useState, useEffect } from 'react';
import api from './components/axios';
import { useCookies } from 'react-cookie';
import LocationInput from './components/LocationInput';
import AircraftList from './components/AircraftList';
import AlertIndicator from './components/AlertIndicator';
import useInterval from './hooks/useInterval';
import './App.css';

const App: React.FC = () => {
    const [closestDistance, setClosestDistance] = useState<number>(Infinity);
    const [proxyTestMessage, setProxyTestMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [cookies] = useCookies(['userLocation', 'userRadius']);
    const userLocation = cookies.userLocation;
    const userRadius = cookies.userRadius;

    // Fetch aircraft data only if location and radius are set
    const updateAircrafts = async () => {
        if (!userLocation || !userRadius) {
            setError("Please set your location and radius.");
            return;
        }

        try {
            const response = await api.get('/api/getAircrafts');
            const closest = Math.min(...response.data.map((ac: { distance: number }) => ac.distance));
            setClosestDistance(closest);
            setError(null); // Clear any previous error
        } catch (err) {
            setError("Failed to update aircraft data.");
            console.error("Error updating aircraft data:", err);
        }
    };

    // Only start interval if location and radius are set
    useInterval(updateAircrafts, userLocation && userRadius ? 1000 : null);

    return (
        <div className="App">
            <h1 className="app-title">Heimeyra Aircraft Proximity Alert</h1>
            <LocationInput />
            {userLocation && userRadius ? (
                <>
                    <AircraftList />
                    <AlertIndicator distance={closestDistance} />
                </>
            ) : (
                <p className="setup-message">Please set your location and radius to begin tracking aircraft.</p>
            )}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default App;
