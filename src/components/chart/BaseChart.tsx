import React, { createContext, useCallback, useMemo, useState } from 'react';

import { ChartContext } from './context';
import { DataValue } from './types';
import './chart.scss';

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
                const min: number = yAxisTicks[0];
                const max: number = yAxisTicks[yAxisTicks.length - 1] as number;
                return ((y - min) / (max - min)) * useAbleHeight + paddingTop;
            }
            const yTickHeight = useAbleHeight / (yAxisTicks.length - 1);
            return yAxisTicks.findIndex((tick) => tick === y) * yTickHeight + paddingTop;
        },
        [yAxisTicks, xTickHeight, height]
    );

    const [hoverItem, setHoverItem] = useState<any>();
    return (
        <ChartContext.Provider
            value={{
                width: width,
                height: height,
                xAxisFn: xAxisFn,
                xAxisTicks: xAxisTicks,
                yAxisFn: yAxisFn,
                yAxisTicks: yAxisTicks,
                xTickHeight: xTickHeight,
                yTickWidth: yTickWidth,
                hoverItem: hoverItem,
                onHoverItem: setHoverItem,
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
                <svg viewBox={`0 0 ${width} ${height}`}>{props.children}</svg>
            </div>
        </ChartContext.Provider>
    );
};
export default BaseChart;
