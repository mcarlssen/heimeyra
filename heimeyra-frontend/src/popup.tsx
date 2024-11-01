import React from 'react';
import { createRoot } from 'react-dom/client';
import WarningPopup from './components/WarningPopup';
import './App.css';
import './popup.css';

let root: any = null;

window.addEventListener('message', (event) => {
    if (event.data.type === 'UPDATE_WARNINGS') {
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