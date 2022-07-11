import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ChartContext } from './context';
import { DataValue, Padding, Point, Rect } from './types';
import { CanvasRender } from './CanvasRender';
import { pxToTick, ticksToPx } from './utils';

interface Props {
    width: number;
    height: number;
    padding?: Padding;
    // xAxis
    xAxisTicks: DataValue[];
    xTickHeight?: number;

    // yAxis
    yAxisTicks: DataValue[];
    yTickWidth?: number;
    yTickPosition?: 'right' | 'left';
    DivProps?: React.HTMLAttributes<HTMLDivElement>;
}
const BaseChart: React.FC<Props> = (props) => {
    const {
        width,
        height,
        padding = { top: 20, bottom: 20, left: 20, right: 20 },
        xAxisTicks,
        xTickHeight = 30,
        yAxisTicks,
        yTickWidth = 30,
        yTickPosition = 'left',
        DivProps,
    } = props;

    const canvas = useRef<HTMLCanvasElement>(null);
    const [canvasRender, setCanvasRender] = useState<CanvasRender | null>(null);
    useEffect(() => {
        if (canvas.current) {
            setCanvasRender(new CanvasRender({ canvas: canvas.current }));
        }
    }, [width, height]);

    const content: Rect = {
        x: yTickPosition === 'left' ? yTickWidth : 0 + padding.left,
        y: padding.top,
        width: width - yTickWidth - padding.left - padding.right,
        height: height - xTickHeight - padding.top - padding.bottom,
    };
    const xAxisFn = useCallback(
        (x: DataValue) => {
            return ticksToPx({
                target: x,
                ticks: xAxisTicks,
                start: content.x,
                end: content.x + content.width,
            });
        },
        [xAxisTicks, content.x, content.width]
    );
    const yAxisFn = useCallback(
        (y: DataValue) => {
            return ticksToPx({
                target: y,
                ticks: yAxisTicks,
                start: content.y + content.height,
                end: content.y,
            });
        },
        [yAxisTicks, content.y, content.height]
    );

    /**
     * hover
     */
    const [hover, setHover] = useState<Point>();
    const handleMouseMove = (e) => {
        if (canvas.current) {
            const cRect = canvas.current.getBoundingClientRect(); // Gets CSS pos, and width/height
            const canvasX = e.clientX - cRect.left; // Subtract the 'left' of the canvas
            const canvasY = e.clientY - cRect.top;
            const tickX = pxToTick({
                target: canvasX,
                ticks: xAxisTicks,
                start: content.x,
                end: content.x + content.width,
            });
            const tickY = pxToTick({
                target: canvasY,
                ticks: yAxisTicks,
                start: content.y + content.height,
                end: content.y,
            });
            if (tickX === null || tickY === null) {
                if (hover) {
                    setHover(undefined);
                }
            } else if (hover?.x !== tickX || hover.y !== tickY) {
                setHover({ x: tickX, y: tickY });
            }
        }
    };
    canvasRender?.clear();
    return (
        <ChartContext.Provider
            value={{
                canvasRender: canvasRender,
                content: content,
                xAxisFn: xAxisFn,
                xAxisTicks: xAxisTicks,
                yAxisFn: yAxisFn,
                yAxisTicks: yAxisTicks,
                xTickHeight: xTickHeight,
                yTickWidth: yTickWidth,
                yTickPosition: yTickPosition,
                hover: hover,
            }}
        >
            <div
                {...DivProps}
                className="chart-root"
                style={{
                    ...DivProps?.style,
                    width: width,
                    height: height,
                    cursor: DivProps?.onMouseDown ? 'grab' : undefined,
                }}
            >
                <canvas
                    style={{ border: 1, borderColor: 'black', borderStyle: 'solid' }}
                    ref={canvas}
                    width={width}
                    height={height}
                    onMouseMove={handleMouseMove}
                >
                    {props.children}
                </canvas>
            </div>
        </ChartContext.Provider>
    );
};
export default BaseChart;
