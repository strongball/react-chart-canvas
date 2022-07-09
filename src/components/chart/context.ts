import React, { createContext } from 'react';

import { DataValue } from './types';

import { CanvasRender } from './CanvasRender';

interface HoverPayload<T> {
    x: number;
    y: number;
    data: T;
}
interface ChartContextProps {
    canvasRender: CanvasRender | null;
    width: number;
    height: number;
    xAxisFn: (x: DataValue) => number;
    yAxisFn: (x: DataValue) => number;
    xAxisTicks: DataValue[];
    yAxisTicks: DataValue[];
    xTickHeight: number;
    yTickWidth: number;
    hoverItem?: HoverPayload<any>;
}
export const ChartContext = createContext<ChartContextProps>({
    canvasRender: null,
    width: 0,
    height: 0,
    xAxisTicks: [],
    xAxisFn: () => 0,
    yAxisTicks: [],
    yAxisFn: () => 0,
    xTickHeight: 20,
    yTickWidth: 30,
});
