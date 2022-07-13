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
    const { render, content, yAxisFn, yAxisTicks, yTickWidth, yTickPosition } = useContext(ChartContext);
    const yTickInterval = Math.ceil(yAxisTicks.length / maxTickCount);

    if (render) {
        yAxisTicks
            .filter((_, index) => index % yTickInterval === 0)
            .forEach((yAxisTick, index) => {
                line &&
                    render.drawLine(
                        { x: content.x, y: yAxisFn(yAxisTick) },
                        { x: content.x + content.width, y: yAxisFn(yAxisTick) },
                        { strokeStyle: '#cfcfcf' }
                    );

                render.drawText(
                    label(yAxisTick),
                    {
                        x: yTickPosition === 'left' ? 10 : content.x + content.width + 10,
                        y: yAxisFn(yAxisTick) + fontSize / 2,
                    },
                    { font: `${fontSize}px` }
                );
            });
    }

    return (
        <>
            {render &&
                yAxisTicks.map((yAxisTick, index) => (
                    <React.Fragment key={yAxisTick}>
                        {line &&
                            render.drawLine(
                                { x: content.x, y: yAxisFn(yAxisTick) },
                                { x: content.x + content.width, y: yAxisFn(yAxisTick) },
                                { strokeStyle: '#cfcfcf' }
                            )}
                        {index % yTickInterval === 0 &&
                            render.drawText(
                                label(yAxisTick),
                                {
                                    x: yTickPosition === 'left' ? 10 : content.x + content.width + 10,
                                    y: yAxisFn(yAxisTick) + fontSize / 2,
                                },
                                { font: `${fontSize}px` }
                            )}
                    </React.Fragment>
                ))}
        </>
    );
};
export default YAxis;
