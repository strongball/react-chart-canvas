import React, { createContext } from 'react';

import { DataValue, Point, Rect } from './types';

import { CanvasRender } from './CanvasRender';

interface ChartContextProps {
    canvasRender: CanvasRender | null;
    content: Rect;
    xAxisFn: (x: DataValue) => number;
    yAxisFn: (x: DataValue) => number;
    xAxisTicks: DataValue[];
    yAxisTicks: DataValue[];
    xTickHeight: number;
    yTickWidth: number;
    yTickPosition: 'right' | 'left';
    hover?: Point;
}
export const ChartContext = createContext<ChartContextProps>({
    canvasRender: null,
    content: { x: 0, y: 9, width: 0, height: 0 },
    xAxisTicks: [],
    xAxisFn: () => 0,
    yAxisTicks: [],
    yAxisFn: () => 0,
    xTickHeight: 20,
    yTickWidth: 30,
    yTickPosition: 'right',
});
