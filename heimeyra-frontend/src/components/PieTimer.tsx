import React, { useEffect, useRef, useState, useCallback } from 'react';

interface PieTimerProps {
    duration: number;
    size?: number;
    color?: string;
    backgroundColor?: string;
    isPaused?: boolean;
}

const PieTimer: React.FC<PieTimerProps> = ({
    duration,
    size = 30,
    color = '#ebb400',
    backgroundColor = '#3a3a3a',
    isPaused = false
}) => {
    const [progress, setProgress] = useState(0);
    const requestRef = useRef<number>();
    const startTimeRef = useRef<number>();
    
    const radius = size / 2;
    const normalizedRadius = radius * 0.8;
    
    // Calculate the path for the arc
    const getArcPath = (percentage: number) => {
        const x = radius;
        const y = radius;
        const r = normalizedRadius;
        const startAngle = 0;
        const endAngle = (percentage * 360) - 90; // -90 to start from top
        
        const start = polarToCartesian(x, y, r, endAngle);
        const end = polarToCartesian(x, y, r, startAngle - 90);
        
        const largeArcFlag = percentage > 0.5 ? 1 : 0;
        
        return [
            "M", start.x, start.y,
            "A", r, r, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
    };

    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
        const angleInRadians = (angleInDegrees) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    const animate = useCallback((timestamp: number) => {
        if (!startTimeRef.current) {
            startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const newProgress = Math.min(elapsed / duration, 1);
        
        setProgress(newProgress);

        if (elapsed < duration) {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            startTimeRef.current = timestamp;
            requestRef.current = requestAnimationFrame(animate);
        }
    }, [duration]);

    useEffect(() => {
        if (!isPaused) {
            startTimeRef.current = undefined;
            requestRef.current = requestAnimationFrame(animate);
        } else if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
        }

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [duration, isPaused, animate]);

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background circle */}
            <circle
                cx={radius}
                cy={radius}
                r={normalizedRadius}
                fill="none"
                stroke={backgroundColor}
                strokeWidth={size * 0.1}
            />
            {/* Timer arc */}
            <path
                d={getArcPath(1 - progress)}
                fill="none"
                stroke={color}
                strokeWidth={size * 0.1}
                strokeLinecap="round"
            />
        </svg>
    );
};

export default PieTimer;