import React, { useState, useEffect } from 'react';
import api from './api/api';
import { useCookies } from 'react-cookie';
import LocationInput from './components/LocationInput';
import AircraftList from './components/AircraftList';
import AlertIndicator from './components/AlertIndicator';
import useInterval from './hooks/useInterval';
import './App.css';
import LocationControls from './components/LocationControls';
import LoadingCountdown from './components/LoadingCountdown';
import WarningIndicators from './components/WarningIndicators';
import LocationMap from './components/LocationMap'; 


const App: React.FC = () => {
    const [closestDistance, setClosestDistance] = useState<number>(Infinity);
    const [proxyTestMessage, setProxyTestMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [cookies] = useCookies(['userLocation', 'userRadius', 'userAltitude']);
    
    // Default values for render, but don't set cookies
    const userLocation = cookies.userLocation ?? {
        lat: 47.6062,  // Seattle's latitude
        lon: -122.3321 // Seattle's longitude
    };
    const userRadius = cookies.userRadius ?? 10;
    const userAltitude = cookies.userAltitude ?? 15000;
    const [updateFrequency, setUpdateFrequency] = useState<number>(5);
    const [nearestDistance, setNearestDistance] = useState<number>(Infinity);
    const [updateTrigger, setUpdateTrigger] = useState(Date.now());
    const [isPaused, setIsPaused] = useState(false);

    const handlePauseToggle = async () => {
        const newPauseState = !isPaused;
        setIsPaused(newPauseState);
        
        try {
            await api.post('/api/setPauseState', { 
                isPaused: newPauseState 
            });
        } catch (err) {
            console.error('Error updating pause state:', err);
            setIsPaused(!newPauseState);
        }
    };

    const handleUpdateComplete = () => {
        setUpdateTrigger(Date.now());
    };

    return (
        <div className="app-container">
            <div className="top-banner">
                <div className="app-title">heimeyra</div>
                <div className="banner-right">
                <LoadingCountdown 
                    frequency={updateFrequency} 
                    startTime={updateTrigger}
                    isPaused={isPaused}
                    onPauseToggle={handlePauseToggle}
                />
                    <WarningIndicators distance={nearestDistance} />
                </div>
            </div>
            
            <div className="main-content">
                <div className="aircraft-list">
                    <AircraftList 
                        onNearestUpdate={setNearestDistance}
                        frequency={updateFrequency}
                        onUpdateComplete={handleUpdateComplete}
                        isPaused={isPaused}
                    />
                </div>
                <div className="map-container">

                <LocationMap />
            </div>
                <div className="controls-container">
                    <LocationControls 
                        onFrequencyChange={setUpdateFrequency}
                        frequency={updateFrequency}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
