import React, { createContext } from 'react';

import { DataValue } from './types';

import './chart.scss';

interface HoverPayload<T> {
    x: number;
    y: number;
    data: T;
}
interface ChartContextProps {
    width: number;
    height: number;
    xAxisFn: (x: DataValue) => number;
    yAxisFn: (x: DataValue) => number;
    xAxisTicks: DataValue[];
    yAxisTicks: DataValue[];
    xTickHeight: number;
    yTickWidth: number;
    hoverItem?: HoverPayload<any>;
    onHoverItem: (data?: HoverPayload<any>) => void;
}
export const ChartContext = createContext<ChartContextProps>({
    width: 0,
    height: 0,
    xAxisTicks: [],
    xAxisFn: () => 0,
    yAxisTicks: [],
    yAxisFn: () => 0,
    xTickHeight: 20,
    yTickWidth: 30,
    onHoverItem: () => {},
});
