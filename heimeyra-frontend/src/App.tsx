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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const App: React.FC = () => {
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

    return (
        <div className="app-container">
            <div className="top-banner">
                <div className="banner-left">
                    <div className="app-title">
                        <FontAwesomeIcon icon="plane-circle-exclamation" /> heimeyra
                    </div>
                    <div className="header-links">
                        <h2 
                        className="header-link" 
                        onClick={() => setAboutOpen(true)}
                    >
                        <FontAwesomeIcon icon="circle-info" />
                    </h2>
                    <h2 
                        className="header-link" 
                        onClick={() => setHelpOpen(true)}
                    >
                        <FontAwesomeIcon icon="circle-question" />
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
