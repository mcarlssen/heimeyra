import React from 'react';
import { createRoot } from 'react-dom/client';
import WarningPopup from './components/WarningPopup';
import './App.css';
import './popup.css';

let root: any = null;

window.addEventListener('message', (event) => {
    console.log('Popup received message:', event.data);
    if (event.data.type === 'UPDATE_WARNINGS') {
        console.log('Creating/updating root with data:', {
            distance: event.data.distance,
            userRadius: event.data.userRadius
        });
        if (!root) {
            root = createRoot(document.getElementById('warning-popup-root')!);
        }
        
        root.render(
            <React.StrictMode>
                <WarningPopup 
                    distance={event.data.distance} 
                    userRadius={event.data.userRadius} 
                />
            </React.StrictMode>
        );
    }
});