import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import api from '../api/api';
import { useDebounce } from '../hooks/useDebounce';
import LoadingCountdown from './LoadingCountdown';

interface LocationControlsProps {
    onFrequencyChange: (freq: number) => void;
    frequency: number;
    onCountdownComplete?: () => void;
    isPaused?: boolean;
    onPauseToggle?: () => void;
}

const statuteToNautical = (statuteMiles: number): number => {
    return statuteMiles * 0.868976;
};

const nauticalToStatute = (nauticalMiles: number): number => {
    return nauticalMiles * 1.15078;
};

const LocationControls: React.FC<LocationControlsProps> = ({ 
    onFrequencyChange, 
    frequency, 
    onCountdownComplete, 
    isPaused, 
    onPauseToggle 
}) => {
    const [cookies, setCookie] = useCookies(['userLocation', 'userRadius', 'userAltitude']);

    // Default values
    const DEFAULT_RADIUS = 1.5;
    const DEFAULT_ALTITUDE = 8000;

    // Access userLocation directly without parsing
    const parsedLocation = cookies.userLocation || null;

    // Initialize state with parsed values or defaults
    const [lat, setLat] = useState(parsedLocation?.lat || '');
    const [lon, setLon] = useState(parsedLocation?.lon || '');
    const [radius, setRadius] = useState(
        cookies.userRadius ? nauticalToStatute(cookies.userRadius) : DEFAULT_RADIUS
    );
    const [altitude, setAltitude] = useState(
        cookies.userAltitude || DEFAULT_ALTITUDE
    );

    // Set default cookies on mount if they don't exist
    useEffect(() => {
        if (!cookies.userRadius) {
            const defaultRadiusNautical = statuteToNautical(DEFAULT_RADIUS);
            setCookie('userRadius', defaultRadiusNautical, { path: '/' });
        }
        if (!cookies.userAltitude) {
            setCookie('userAltitude', DEFAULT_ALTITUDE, { path: '/' });
        }

        // If we have location but missing other settings, save them to backend
        if (parsedLocation && (!cookies.userRadius || !cookies.userAltitude)) {
            saveSettings(DEFAULT_RADIUS, DEFAULT_ALTITUDE);
        }
    }, []);  // Run once on mount

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
        element.style.background = `linear-gradient(to right, var(--text-accent-color) 0%, var(--text-accent-color) ${percent}%, var(--border-color) ${percent}%, var(--border-color) 100%)`;
    };

    // Set initial slider backgrounds on mount
    useEffect(() => {
        const radiusSlider = document.querySelector('.radius-slider') as HTMLInputElement;
        const altitudeSlider = document.querySelector('.altitude-slider') as HTMLInputElement;
        
        if (radiusSlider) {
            updateSliderBackground(radiusSlider, radius, 1, 5);
        }
        if (altitudeSlider) {
            updateSliderBackground(altitudeSlider, altitude, 1000, 47000);
        }
    }, []); // Run once on mount
    
    const debounce = (func: Function, wait: number) => {
        let timeout: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    const saveSettings = async (newRadius?: number, newAltitude?: number) => {
        try {
            const settingsData = {
                lat: parsedLocation?.lat,
                lon: parsedLocation?.lon,
                radius: newRadius || radius,
                altitude: newAltitude || altitude,
            };

            // Update cookies (but don't update userLocation cookie here)
            setCookie('userRadius', settingsData.radius, { path: '/' });
            setCookie('userAltitude', settingsData.altitude, { path: '/' });

            await api.post('/api/setLocation', settingsData);
            console.log('settingsData:', settingsData);
        } catch (err) {
            console.error('Error saving settings:', err);
        }
    };

    // Debounced save function (500ms delay)
    const debouncedSave = useDebounce(async (newRadius?: number, newAltitude?: number) => {
        try {
            const settingsData = {
                lat: parsedLocation?.lat,
                lon: parsedLocation?.lon,
                radius: statuteToNautical(newRadius || radius),
                altitude: newAltitude || altitude,
            };

            // Update cookies
            setCookie('userRadius', settingsData.radius, { path: '/' });
            setCookie('userAltitude', settingsData.altitude, { path: '/' });

            await api.post('/api/setLocation', settingsData);
            console.log('settingsData:', settingsData);
        } catch (err) {
            console.error('Error saving settings:', err);
        }
    }, 750);

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
                        <span>Audible Radius</span>
                        <span className="slider-value">{radius.toFixed(1)} mi</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        step="0.1"
                        value={radius}
                        onChange={(e) => {
                            const newRadius = Number(e.target.value);
                            setRadius(newRadius);
                            updateSliderBackground(e.target, newRadius, 1, 5);
                            debouncedSave(newRadius, undefined);
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
                            debouncedSave(undefined, newAltitude);
                        }}
                        className="altitude-slider"
                    />
                </div>
            </div>

            <div className="controls-bottom">
                <div className="countdown-container">
                    <LoadingCountdown
                        frequency={frequency}
                        onComplete={onCountdownComplete}
                        isPaused={isPaused}
                        onPauseToggle={onPauseToggle}
                    />
                </div>
                <div className="update-frequency">
                    <label className="update-frequency-label">Refresh</label>
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
        </div>
    );
};

export default LocationControls;
