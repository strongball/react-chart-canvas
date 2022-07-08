import React, { useContext } from 'react';
import { ChartContext } from './context';
import { DataValue } from './types';

interface Props {
    maxTickCount?: number;
    fontSize?: number;
    label?: (value: DataValue) => string;
}
const XAxis: React.FC<Props> = (props) => {
    const { maxTickCount = 10, fontSize = 8, label = (v) => v.toString() } = props;
    const { xAxisFn, yAxisFn, xAxisTicks, yAxisTicks, xTickHeight } = useContext(ChartContext);
    const xTickInterval = Math.ceil(xAxisTicks.length / maxTickCount);

    return (
        <g className="xAxis">
            {xAxisTicks.map((xAxisTick, index) => (
                <React.Fragment key={xAxisTick}>
                    <line
                        className={((xAxisTicks.length - index) % xTickInterval).toString()}
                        x1={xAxisFn(xAxisTick)}
                        y1={yAxisFn(yAxisTicks[0])}
                        x2={xAxisFn(xAxisTick)}
                        y2={yAxisFn(yAxisTicks[yAxisTicks.length - 1])}
                        stroke="#cfcfcf"
                    />
                    {(xAxisTicks.length - index + 1) % xTickInterval === 0 && (
                        <text
                            className="tick-text"
                            fontSize={fontSize}
                            x={xAxisFn(xAxisTick) - 20}
                            y={yAxisFn(yAxisTicks[yAxisTicks.length - 1]) + xTickHeight / 2}
                        >
                            {label(xAxisTick)}
                        </text>
                    )}
                </React.Fragment>
            ))}
        </g>
    );
};
export default XAxis;
