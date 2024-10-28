import { useEffect, useRef } from 'react';

const useInterval = (callback: () => void, delay: number | null) => { // Accepts number or null
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay !== null) { // Only set interval if delay is not null
            const id = setInterval(() => savedCallback.current(), delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};

export default useInterval;
