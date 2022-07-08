import React, { useEffect, useRef } from 'react';

interface SwipeControlOptions {
    onSwipe: (value: number) => void;
    delay?: number;
}
export function useSwipeControl({
    onSwipe,
    delay = 10,
}: SwipeControlOptions): Pick<
    React.HTMLAttributes<HTMLDivElement>,
    'onMouseDown' | 'onMouseUp' | 'onMouseMove' | 'onMouseLeave' | 'onTouchMove' | 'onTouchEnd'
> {
    const swipeValue = useRef<number>(0);
    const swipeTimeout = useRef<number>();
    const handleSwipe = (value: number) => {
        swipeValue.current += value;
        if (swipeTimeout.current) {
            clearTimeout(swipeTimeout.current);
        }
        swipeTimeout.current = setTimeout(() => {
            onSwipe(swipeValue.current);
            swipeValue.current = 0;
        }, delay);
    };
    useEffect(() => {
        return () => {
            if (swipeTimeout.current) {
                clearTimeout(swipeTimeout.current);
            }
        };
    }, []);

    /**
     * mouse
     */
    const moving = useRef<boolean>(false);
    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        moving.current = true;
    };
    const onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        moving.current = false;
    };
    const onMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        moving.current = false;
    };
    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!moving.current) {
            return;
        }
        handleSwipe(e.movementX);
    };

    /**
     * touch
     */
    const preTouchX = useRef<number | null>();
    const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (e.touches.length > 1) {
            return;
        }
        if (!preTouchX.current) {
            preTouchX.current = e.touches[0].screenX;
        }
        const moveX = e.touches[0].screenX - preTouchX.current;
        preTouchX.current = e.touches[0].screenX;

        handleSwipe(moveX);
    };
    const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        preTouchX.current = null;
    };

    return { onMouseUp, onMouseDown, onMouseMove, onMouseLeave, onTouchMove, onTouchEnd };
}
