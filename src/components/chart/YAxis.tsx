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
    const { canvasRender, content, yAxisFn, yAxisTicks, yTickWidth, yTickPosition } = useContext(ChartContext);
    const yTickInterval = Math.ceil(yAxisTicks.length / maxTickCount);
    if (canvasRender) {
        yAxisTicks.forEach((yAxisTick, index) => {
            if (line) {
                canvasRender.drawLine(
                    { x: content.x, y: yAxisFn(yAxisTick) },
                    { x: content.x + content.width, y: yAxisFn(yAxisTick) },
                    { strokeStyle: '#cfcfcf' }
                );
            }
            if (index % yTickInterval === 0) {
                const x = yTickPosition === 'left' ? 10 : content.x + content.width + 10;
                canvasRender.drawText(
                    label(yAxisTick),
                    {
                        x: x,
                        y: yAxisFn(yAxisTick) + fontSize / 2,
                    },
                    { font: `${fontSize}px` }
                );
            }
        });
    }
    return null;
};
export default YAxis;
