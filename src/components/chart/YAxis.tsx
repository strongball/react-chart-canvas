import React, { useContext } from 'react';
import { ChartContext } from './context';
import { DataValue } from './types';

interface Props {
    maxTickCount?: number;
    fontSize?: number;
    label?: (value: DataValue) => string;
    line?: boolean;
}
const YAxis: React.FC<Props> = (props) => {
    const { maxTickCount = 10, fontSize = 8, label = (v) => v.toString(), line = true } = props;
    const { canvasRender, xAxisFn, yAxisFn, xAxisTicks, yAxisTicks, yTickWidth } = useContext(ChartContext);
    const yTickInterval = Math.ceil(yAxisTicks.length / maxTickCount);
    canvasRender &&
        yAxisTicks.forEach((yAxisTick, index) => {
            if (line) {
                canvasRender.drawLine(
                    { x: xAxisFn(xAxisTicks[0]), y: yAxisFn(yAxisTick) },
                    { x: xAxisFn(xAxisTicks[xAxisTicks.length - 1]), y: yAxisFn(yAxisTick) },
                    { strokeStyle: '#cfcfcf' }
                );
            }
            if ((yAxisTicks.length - index + 1) % yTickInterval === 0) {
                canvasRender.drawText(
                    label(yAxisTick),
                    {
                        x: xAxisFn(xAxisTicks[0]) - yTickWidth,
                        y: yAxisFn(yAxisTick) + fontSize / 2,
                    },
                    { font: `${fontSize}px` }
                );
            }
        });
    return null;
};
export default YAxis;
