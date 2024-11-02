import React, { useState, useEffect } from 'react';
import api from './api/api';
import { useCookies } from 'react-cookie';
import AircraftList from './components/AircraftList';
import './App.css';
import LocationControls from './components/LocationControls';
import WarningIndicators from './components/WarningIndicators';
import LocationMap from './components/LocationMap'; 
import Footer from './components/Footer';
import Modal from './components/Modal';  // Your existing Modal component

const App: React.FC = () => {
    const [closestDistance, setClosestDistance] = useState<number>(Infinity);
    const [error, setError] = useState<string | null>(null);
    const [cookies] = useCookies(['userLocation', 'userRadius', 'userAltitude']);
    
    // Default values for render, but don't set cookies
    const userLocation = cookies.userLocation ?? {
        lat: 47.6062,  // Seattle's latitude
        lon: -122.3321 // Seattle's longitude
    };
    const userRadius = cookies.userRadius ?? 1.5;
    const userAltitude = cookies.userAltitude ?? 8000;
    const [updateFrequency, setUpdateFrequency] = useState<number>(5);
    const [nearestDistance, setNearestDistance] = useState<number>(Infinity);
    const [updateTrigger, setUpdateTrigger] = useState(Date.now());
    const [isPaused, setIsPaused] = useState(false);
    const [aboutOpen, setAboutOpen] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);

    const aboutContent = (
        <>
            <p>Heimeyra is a real-time aircraft tracking visualization tool.</p>
            <p>Version 1.0.0</p>
            <a 
                href='https://ko-fi.com/U7U24513O' 
                target='_blank' 
                rel="noopener noreferrer"
                className="kofi-button"
                style={{ 
                    backgroundColor: '#ebb400',
                    color: '#fff',
                    padding: '5px 15px',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    display: 'inline-block',
                    fontWeight: 'bold'
                }}
            >
                ☕ Caffeinate the code hamster
            </a>
        </>
    );

    const helpContent = (
        <>
            <h2>Help</h2>
            <h3>Getting Started</h3>
            <p>1. Set your location using the latitude and longitude fields</p>
            <p>2. Adjust the radius to define your search area</p>
            <p>3. Set your preferred refresh rate</p>
        </>
    );

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
                <div className="banner-left">
                    <div className="app-title"><i className="fa-solid fa-plane-circle-exclamation"></i> heimeyra</div>
                    <div className="header-links">
                    <h2 
                        className="header-link" 
                        onClick={() => setAboutOpen(true)}
                    >
                        About
                    </h2>
                    <h2 
                        className="header-link" 
                        onClick={() => setHelpOpen(true)}
                    >
                        Help
                        </h2>
                    </div>
                </div>
                <div className="banner-right">
                    <WarningIndicators 
                        distance={nearestDistance} 
                        userRadius={userRadius}
                    />
                </div>
            </div>
            
            <div className="main-content">
                <div className="aircraft-list">
                    <AircraftList 
                        onNearestUpdate={setNearestDistance}
                        frequency={updateFrequency}
                        onUpdateComplete={handleUpdateComplete}
                        isPaused={isPaused}
                        userRadius={userRadius}
                    />
                </div>
                <div className="map-container">

                <LocationMap />
            </div>
                <div className="controls-container">
                    <LocationControls 
                        onFrequencyChange={setUpdateFrequency}
                        frequency={updateFrequency}
                        onCountdownComplete={handleUpdateComplete}
                        isPaused={isPaused}
                        onPauseToggle={handlePauseToggle}
                    />
                </div>
            </div>
            <Footer />
            <Modal 
                isOpen={aboutOpen}
                onClose={() => setAboutOpen(false)}
                title="About"
            >
                {aboutContent}
            </Modal>

            <Modal 
                isOpen={helpOpen}
                onClose={() => setHelpOpen(false)}
                title="Help"
            >
                {helpContent}
            </Modal>
        </div>
    );
};

export default App;
