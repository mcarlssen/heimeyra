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
    const [cookies] = useCookies(['userLocation', 'userRadius']);
    const userLocation = cookies.userLocation;
    const userRadius = cookies.userRadius;
    const [updateFrequency, setUpdateFrequency] = useState<number>(5);
    const [nearestDistance, setNearestDistance] = useState<number>(Infinity);
    const [updateTrigger, setUpdateTrigger] = useState(Date.now());
    const [lat, setLat] = useState(cookies.userLocation?.lat || '');
    const [lon, setLon] = useState(cookies.userLocation?.lon || '');

    const handleUpdateComplete = () => {
        setUpdateTrigger(Date.now());
    };

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

    // Add this function before the return statement
    const handleLocationChange = (newLat: string, newLon: string) => {
        setLat(newLat);
        setLon(newLon);
        // We need to pass radius and altitude from LocationControls
        // This will require lifting state up or using context
        // For now, we'll just update the coordinates
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
                    containerHeight={275}
                    containerWidth={515}
                    onLocationChange={handleLocationChange}
                    onCenterChange={(newLat, newLon) => {
                        setLat(newLat);
                        setLon(newLon);
                    }}
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
