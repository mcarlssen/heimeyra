import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import LocationMap from './LocationMap';

interface LocationControlsProps {
    onFrequencyChange: (freq: number) => void;
    frequency: number;
}

// Add conversion helper
const statuteToNautical = (statuteMiles: number): number => {
    return statuteMiles * 0.868976;
};

const nauticalToStatute = (nauticalMiles: number): number => {
    return nauticalMiles * 1.15078;
};

const LocationControls: React.FC<LocationControlsProps> = ({ 
    onFrequencyChange, 
    frequency 
}) => {
    const [cookies] = useCookies(['userLocation', 'userRadius', 'userAltitude']);

    // Parse userLocation cookie
    const parsedLocation = (() => {
        try {
            return cookies.userLocation ? JSON.parse(cookies.userLocation) : null;
        } catch (e) {
            console.error('Error parsing userLocation cookie:', e);
            return null;
        }
    })();

    // Initialize state with parsed values
    const [lat, setLat] = useState(parsedLocation?.lat || '');
    const [lon, setLon] = useState(parsedLocation?.lon || '');
    const [radius, setRadius] = useState(
        cookies.userRadius ? nauticalToStatute(cookies.userRadius) : 10
    );
    const [altitude, setAltitude] = useState(
        cookies.userAltitude || 15000
    );

    // Update state when cookies change
    useEffect(() => {
        if (parsedLocation) {
            setLat(parsedLocation.lat);
            setLon(parsedLocation.lon);
        }
    }, [parsedLocation]);

    // Function to update slider background
    const updateSliderBackground = (
        element: HTMLInputElement, 
        value: number, 
        min: number, 
        max: number
    ) => {
        const percent = ((value - min) / (max - min)) * 100;
        element.style.background = `linear-gradient(to right, var(--accent-color) 0%, var(--accent-color) ${percent}%, var(--border-color) ${percent}%, var(--border-color) 100%)`;
    };

    // Set initial slider backgrounds on mount
    useEffect(() => {
        const radiusSlider = document.querySelector('.radius-slider') as HTMLInputElement;
        const altitudeSlider = document.querySelector('.altitude-slider') as HTMLInputElement;
        
        if (radiusSlider) {
            updateSliderBackground(radiusSlider, radius, 1, 50);
        }
        if (altitudeSlider) {
            updateSliderBackground(altitudeSlider, altitude, 1000, 45000);
        }
    }, []); // Run once on mount
    
    const debounce = (func: Function, wait: number) => {
        let timeout: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    const saveSettings = async (newLat?: string, newLon?: string, newRadius?: number, newAltitude?: number) => {
        // Don't save if lat/lon are empty
        if (!newLat || !newLon) return;

        try {
            const locationData = {
                lat: parseFloat(newLat),
                lon: parseFloat(newLon),
                radius: statuteToNautical(parseFloat(String(newRadius || radius))),
                altitude: parseFloat(String(newAltitude || altitude))
            };

            await fetch('http://localhost:5000/api/setLocation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(locationData)
            });
        } catch (err) {
            console.error('Error saving location:', err);
        }
    };

    const debouncedSave = debounce(saveSettings, 500);
    const [zoom, setZoom] = useState<number>(8);  // Add this if missing


    return (
        <div className="controls-container">
            <div className="location-inputs">
                <div className="input-group">
                    <label>Latitude</label>
                    <input
                        type="text"
                        value={lat}
                        readOnly
                        placeholder="No location set"
                    />
                </div>
                <div className="input-group">
                    <label>Longitude</label>
                    <input
                        type="text"
                        value={lon}
                        readOnly
                        placeholder="No location set"
                    />
                </div>
            </div>

            <div className="sliders-container">
                <div className="radius-control">
                    <div className="slider-label">
                        <span>Radius</span>
                        <span className="slider-value">{Math.round(radius)} mi</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="50"
                        value={radius}
                        onChange={(e) => {
                            const newRadius = Number(e.target.value);
                            setRadius(newRadius);
                            updateSliderBackground(e.target, newRadius, 1, 50);
                            debouncedSave(lat, lon, newRadius, altitude);
                        }}
                        className="radius-slider"
                    />
                </div>
                
                <div className="altitude-control">
                    <div className="slider-label">
                        <span>Max Alt</span>
                        <span className="slider-value">{Math.round(altitude)} ft</span>
                    </div>
                    <input
                        type="range"
                        min="1000"
                        max="45000"
                        step="1000"
                        value={altitude}
                        onChange={(e) => {
                            const newAltitude = Number(e.target.value);
                            setAltitude(newAltitude);
                            updateSliderBackground(e.target, newAltitude, 1000, 45000);
                            debouncedSave(lat, lon, radius, newAltitude);
                        }}
                        className="altitude-slider"
                    />
                </div>
            </div>

            <div className="update-frequency">
                <label className="update-frequency-label">Refresh:</label>
                <div className="radio-group">
                    {[1, 5, 10].map(freq => (
                        <label key={freq} className="radio-label">
                            <input
                                type="radio"
                                name="frequency"
                                value={freq}
                                checked={frequency === freq}
                                onChange={() => onFrequencyChange(freq)}
                            />
                            {freq}s
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LocationControls;