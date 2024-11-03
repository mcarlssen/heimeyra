import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useCookies } from 'react-cookie';
import api from '../api/api';
import { useDebounce } from '../hooks/useDebounce';
import { ToggleButtonGroup, ToggleButton, TextField } from '@mui/material';
import PieTimer from './PieTimer';  // Add this import
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faOne, faFive, faZero } from '../fontawesome';


// Create theme outside of component to prevent recreation on each render
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#2a2a2a',
        },
    },
    components: {
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    color: '#ddd',
                    backgroundColor: '#3a3a3a',
                    border: '1px solid #3a3a3a',
                    padding: '7px 0',
                    minWidth: '50px',
                    minHeight: '34px',
                    '& .fa-solid': {  // Target FontAwesome icons
                        color: '#ddd',  // Default icon color
                    },
                    '&.Mui-selected': {
                        backgroundColor: '#ebb400',
                        color: '#1a1a1a',
                        '& .fa-solid': {  // Target FontAwesome icons when selected
                            color: '#2a2a2a',  // Dark color for better contrast on yellow
                        },
                        '&:hover': {
                            backgroundColor: '#ebb400',
                        },
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                },
            },
        },
        MuiToggleButtonGroup: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    gap: '2px',
                    '& .MuiToggleButton-root:first-of-type': {
                        borderTopLeftRadius: '12px',
                        borderBottomLeftRadius: '12px',
                    },
                    '& .MuiToggleButton-root:last-of-type': {
                        borderTopRightRadius: '12px',
                        borderBottomRightRadius: '12px',
                    },
                },
            },
        },
    },
});

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
    isPaused, 
    onPauseToggle 
}) => {
    const [cookies, setCookie] = useCookies(['userLocation', 'userRadius', 'userAltitude']);
    const prevLocationRef = useRef(null);  // Move ref here, at component level

    // Default values
    const DEFAULT_RADIUS = 1.5;
    const DEFAULT_ALTITUDE = 8000;

    // Access userLocation directly without parsing
    const parsedLocation = cookies.userLocation || null;

    console.log('LocationControls render:', { parsedLocation, cookies });

    // Initialize state with parsed values or defaults
    const [lat, setLat] = useState(parsedLocation?.lat || '');
    const [lon, setLon] = useState(parsedLocation?.lon || '');
    const [radius, setRadius] = useState(
        cookies.userRadius ? nauticalToStatute(cookies.userRadius) : DEFAULT_RADIUS
    );
    const [altitude, setAltitude] = useState(
        cookies.userAltitude || DEFAULT_ALTITUDE
    );

    // Move saveSettings function before the useEffect that uses it
    const saveSettings = useCallback(async (newRadius?: number, newAltitude?: number) => {
        try {
            console.log('saveSettings called at:', Date.now(), { newRadius, newAltitude });
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
    }, [parsedLocation, radius, altitude, setCookie]);

    useEffect(() => {
        // Only run this once on mount
        if (!cookies.userRadius || !cookies.userAltitude) {
            // Set cookies individually to satisfy TypeScript
            if (!cookies.userRadius) {
                setCookie('userRadius', statuteToNautical(DEFAULT_RADIUS), { path: '/' });
            }
            if (!cookies.userAltitude) {
                setCookie('userAltitude', DEFAULT_ALTITUDE, { path: '/' });
            }

            // Only call API if we have location and needed to set cookies
            if (parsedLocation && (!cookies.userRadius || !cookies.userAltitude)) {
                saveSettings(DEFAULT_RADIUS, DEFAULT_ALTITUDE);
            }
        }
    }, []); // Empty dependency array - only run once on mount

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (parsedLocation) {
            setLat(parsedLocation.lat);
            setLon(parsedLocation.lon);
        }
    }, [parsedLocation]);

    useEffect(() => {
        if (parsedLocation && 
            cookies.userRadius && 
            cookies.userAltitude && 
            // Only save if location actually changed
            JSON.stringify(prevLocationRef.current) !== JSON.stringify(parsedLocation)
        ) {
            prevLocationRef.current = parsedLocation;
            saveSettings(
                parseFloat(cookies.userRadius),
                parseFloat(cookies.userAltitude)
            );
        }
    }, [parsedLocation, cookies.userRadius, cookies.userAltitude, saveSettings]);

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
    }, [radius, altitude]); // Run once on mount

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

    const handleFrequencyChange = useCallback(
        (event: React.MouseEvent<HTMLElement>, newValue: string | null) => {
            if (newValue !== null) {
                const freq = parseInt(newValue);
                if (freq !== frequency) {
                    console.log('Updating frequency to:', freq);
                    onFrequencyChange(freq);
                }
            }
        },
        [frequency, onFrequencyChange]
    );

    return (
        <div className="controls-container">
            <div className="location-inputs">
            <TextField
                label="Latitude"
                value={lat}
                InputProps={{
                    readOnly: true,
                }}
                placeholder="No location set"
                size="medium"
                fullWidth
            />
            <TextField
                label="Longitude"
                value={lon}
                InputProps={{
                    readOnly: true,
                }}
                placeholder="No location set"
                size="medium"
               fullWidth
       />
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
                <div className="update-controls">
                    <label className="update-frequency-label">Refresh</label>
                    <div className="controls-row">
                        <ThemeProvider theme={theme}>
                            <ToggleButtonGroup
                                value={frequency.toString()}
                                exclusive
                                onChange={handleFrequencyChange}
                                aria-label="refresh frequency"
                                size="small"
                            >
                                <ToggleButton value="1">
                                    <FontAwesomeIcon icon={faOne} />
                                </ToggleButton>
                                <ToggleButton value="5">
                                    <FontAwesomeIcon icon={faFive} />
                                </ToggleButton>
                                <ToggleButton value="10">
                                    <FontAwesomeIcon icon={faOne} />
                                    <FontAwesomeIcon icon={faZero} />
                                </ToggleButton>
                            </ToggleButtonGroup>
                            
                            <div className="timer-container">
                                <PieTimer
                                    duration={frequency * 1000}
                                    size={30}
                                    color="#ebb400"
                                    backgroundColor="#3a3a3a"
                                    isPaused={isPaused}
                                />
                            </div>
                        </ThemeProvider>
                    </div>
                </div>
                
                <div className="pause-control">
                    <label className="pause-label">Pause</label>
                    <ThemeProvider theme={theme}>
                        <ToggleButton
                            value="pause"
                            selected={isPaused}
                            onChange={() => onPauseToggle()}
                            size="small"
                            style={{
                                borderRadius: '12px',
                                padding: '7px 12px',
                                minWidth: '50px',
                                minHeight: '50px'
                            }}
                        >
                            <FontAwesomeIcon icon="circle-pause" style={{ fontSize: '36px' }} />
                        </ToggleButton>
                    </ThemeProvider>
                </div>
            </div>
        </div>
    );
};

export default LocationControls;
