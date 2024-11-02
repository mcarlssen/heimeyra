import React, { useState } from 'react';
import api from './api/api';
import { useCookies } from 'react-cookie';
import AircraftList from './components/AircraftList';
import './App.css';
import LocationControls from './components/LocationControls';
import WarningIndicators from './components/WarningIndicators';
import LocationMap from './components/LocationMap'; 
import Footer from './components/Footer';
import Modal from './components/Modal';  // Your existing Modal component
import { AboutContent, HelpContent } from './components/ModalContent';

const App: React.FC = () => {
    const [updateTrigger, setUpdateTrigger] = useState<number>(Date.now());
    const [cookies] = useCookies(['userLocation', 'userRadius', 'userAltitude']);
    const userRadius = cookies.userRadius ?? 1.5;
    const [updateFrequency, setUpdateFrequency] = useState<number>(5);
    const [nearestDistance, setNearestDistance] = useState<number>(Infinity);
    const [isPaused, setIsPaused] = useState(false);
    const [aboutOpen, setAboutOpen] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);

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
                <AboutContent />
            </Modal>

            <Modal 
                isOpen={helpOpen}
                onClose={() => setHelpOpen(false)}
                title="Help"
            >
                <HelpContent />
            </Modal>
        </div>
    );
};

export default App;
