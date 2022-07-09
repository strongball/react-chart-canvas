import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ChartContext } from './context';
import { DataValue } from './types';
import { CanvasRender } from './CanvasRender';

interface Props {
    width: number;
    height: number;
    // xAxis
    xAxisTicks: DataValue[];

    // yAxis
    yAxisTicks: DataValue[];
    yTickWidth?: number;

    DivProps?: React.HTMLAttributes<HTMLDivElement>;
}
const BaseChart: React.FC<Props> = (props) => {
    const { width, height, xAxisTicks, yAxisTicks, yTickWidth = 30, DivProps } = props;

    const canvas = useRef<HTMLCanvasElement>(null);
    const [canvasRender, setCanvasRender] = useState<CanvasRender | null>(null);
    useEffect(() => {
        if (canvas.current) {
            console.log('init canvasRender');
            setCanvasRender(new CanvasRender({ canvas: canvas.current }));
        }
    }, [width, height]);

    const xTickHeight = 20;

    const xAxisFn = useCallback(
        (x: DataValue) => {
            if (xAxisTicks.length === 0) {
                return 0;
            }
            const xTickWidth = (width - yTickWidth - 20) / (xAxisTicks.length - 1);
            return yTickWidth + xAxisTicks.findIndex((tick) => tick === x) * xTickWidth;
        },
        [xAxisTicks, width, yTickWidth]
    );
    const yAxisFn = useCallback(
        (y: DataValue) => {
            const paddingTop = 10;
            if (yAxisTicks.length === 0) {
                return 0;
            }
            const useAbleHeight = height - xTickHeight - paddingTop;
            if (typeof y === 'number' && typeof yAxisTicks[0] === 'number') {
                // numeral
                const min: number = yAxisTicks[0];
                const max: number = yAxisTicks[yAxisTicks.length - 1] as number;
                return ((y - min) / (max - min)) * useAbleHeight + paddingTop;
            }
            const yTickHeight = useAbleHeight / (yAxisTicks.length - 1);
            return yAxisTicks.findIndex((tick) => tick === y) * yTickHeight + paddingTop;
        },
        [yAxisTicks, xTickHeight, height]
    );

    canvasRender?.clear();
    return (
        <ChartContext.Provider
            value={{
                canvasRender: canvasRender,
                width: width,
                height: height,
                xAxisFn: xAxisFn,
                xAxisTicks: xAxisTicks,
                yAxisFn: yAxisFn,
                yAxisTicks: yAxisTicks,
                xTickHeight: xTickHeight,
                yTickWidth: yTickWidth,
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
                >
                    {props.children}
                </canvas>
            </div>
        </ChartContext.Provider>
    );
};
export default BaseChart;
