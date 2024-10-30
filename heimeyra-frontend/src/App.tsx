import React, { useState, useEffect } from 'react';
import api from './components/axios';
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
    const [cookies, setCookie] = useCookies(['userLocation', 'userRadius', 'userAltitude']);
    const userLocation = cookies.userLocation;
    const userRadius = cookies.userRadius;
    const userAltitude = cookies.userAltitude;
    const [updateFrequency, setUpdateFrequency] = useState<number>(5);
    const [nearestDistance, setNearestDistance] = useState<number>(Infinity);
    const [updateTrigger, setUpdateTrigger] = useState(Date.now());
    const [lat, setLat] = useState(cookies.userLocation?.lat || '');
    const [lon, setLon] = useState(cookies.userLocation?.lon || '');
    const [isPaused, setIsPaused] = useState(false);

    const handlePauseToggle = async () => {
        const newPauseState = !isPaused;
        setIsPaused(newPauseState);
        
        try {
            await fetch('http://localhost:5000/api/setPauseState', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ isPaused: newPauseState })
            });
        } catch (err) {
            console.error('Error updating pause state:', err);
            // Optionally revert the state if the backend update fails
            setIsPaused(!newPauseState);
        }
    };

    const handleUpdateComplete = () => {
        setUpdateTrigger(Date.now());
    };

    // Fetch aircraft data only if location and radius are set
    const updateAircrafts = async () => {
        if (!isPaused) {
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
        }
    };

    // Only start interval if location and radius are set, and the app is not paused
    useInterval(updateAircrafts, (userLocation && userRadius && !isPaused) ? 1000 : null);

    // Add this function before the return statement
    const handleBoundsChange = (newLat: number, newLon: number) => {
        console.log('Setting new location:', newLat, newLon);

        //setLat(newLat.toString());
        //setLon(newLon.toString());

        // Update cookies
        setCookie('userLocation', {
            lat: newLat,
            lon: newLon
        });
        setCookie('userRadius', userRadius);
        setCookie('userAltitude', userAltitude);
    };

    // Add state for map center
    const [center, setCenter] = useState<[number, number]>([41, -81]);
    const [zoom, setZoom] = useState<number>(8);  // Add this if missing

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
                    />
                </div>
                <div className="map-container">

                <LocationMap
                    center={[parseFloat(lat) || 41, parseFloat(lon) || -81]}
                    zoom={zoom}
                    onBoundsChanged={handleBoundsChange}
                />
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
