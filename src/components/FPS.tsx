import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface Props {
    label?: string;
}
const FPS: React.FC<Props> = ({ label = 'fps' }) => {
    //  f / s
    const [FPS, setFPS] = useState(0);
    const gap = 100;
    const request = useRef<number>();
    const frame = useRef(0);
    const time = useRef(performance.now());

    const requestFrame = () => {
        return requestAnimationFrame(() => {
            const ctime = performance.now();
            frame.current += 1;
            const interval = ctime - time.current;
            if (interval >= gap) {
                setFPS(frame.current / (interval / 1000));
                frame.current = 0;
                time.current = ctime;
            }
            request.current = requestFrame();
        });
    };
    useEffect(() => {
        request.current = requestFrame();
        return () => {
            request.current && cancelAnimationFrame(request.current);
        };
    }, []);

    return <span>{`${label}: ${FPS.toFixed()}`}</span>;
};
export default FPS;
