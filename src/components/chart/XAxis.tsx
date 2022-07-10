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
    const { canvasRender, content, xAxisFn, xAxisTicks, xTickHeight } = useContext(ChartContext);
    const xTickInterval = Math.ceil(xAxisTicks.length / maxTickCount);
    if (canvasRender) {
        xAxisTicks.forEach((xAxisTick, index) => {
            if (line) {
                canvasRender.drawLine(
                    { x: xAxisFn(xAxisTick), y: content.y },
                    { x: xAxisFn(xAxisTick), y: content.y + content.height },
                    { strokeStyle: '#cfcfcf' }
                );
            }
            // if ((xAxisTicks.length - index - 1) % xTickInterval === 0) {
            if (index % xTickInterval === 0) {
                canvasRender.drawText(
                    label(xAxisTick),
                    {
                        x: xAxisFn(xAxisTick) - fontSize * 2,
                        y: content.y + content.height + xTickHeight + fontSize / 2,
                    },
                    {
                        font: `${fontSize}px`,
                    }
                );
            }
        });
    }
    return null;
};
export default XAxis;
