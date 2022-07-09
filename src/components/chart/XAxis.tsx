import React, { useContext } from 'react';
import { ChartContext } from './context';
import { DataValue } from './types';

interface Props {
    maxTickCount?: number;
    fontSize?: number;
    label?: (value: DataValue) => string;
    line?: boolean;
}
const XAxis: React.FC<Props> = (props) => {
    const { maxTickCount = 10, fontSize = 8, label = (v) => v.toString(), line = true } = props;
    const { canvasRender, xAxisFn, yAxisFn, xAxisTicks, yAxisTicks, xTickHeight } = useContext(ChartContext);
    const xTickInterval = Math.ceil(xAxisTicks.length / maxTickCount);
    canvasRender &&
        xAxisTicks.forEach((xAxisTick, index) => {
            if (line) {
                canvasRender.drawLine(
                    { x: xAxisFn(xAxisTick), y: yAxisFn(yAxisTicks[0]) },
                    { x: xAxisFn(xAxisTick), y: yAxisFn(yAxisTicks[yAxisTicks.length - 1]) },
                    { strokeStyle: '#cfcfcf' }
                );
            }
            if ((xAxisTicks.length - index + 1) % xTickInterval === 0) {
                canvasRender.drawText(
                    label(xAxisTick),
                    {
                        x: xAxisFn(xAxisTick) - 10,
                        y: yAxisFn(yAxisTicks[yAxisTicks.length - 1]) + xTickHeight / 2,
                    },
                    {
                        font: `${fontSize}px`,
                    }
                );
            }
        });
    return null;
};
export default XAxis;
