import React, { useContext } from 'react';
import { ChartContext } from './context';
import { DataValue } from './types';

interface Props {
    maxTickCount?: number;
    fontSize?: number;
    label?: (value: DataValue) => string;
}
const YAxis: React.FC<Props> = (props) => {
    const { maxTickCount = 10, fontSize = 8, label = (v) => v.toString() } = props;
    const { xAxisFn, yAxisFn, xAxisTicks, yAxisTicks, yTickWidth } = useContext(ChartContext);

    const yTickInterval = Math.ceil(yAxisTicks.length / maxTickCount);

    return (
        <g className="yAxis">
            {yAxisTicks.map((yAxisTick, index) => (
                <React.Fragment key={yAxisTick}>
                    <line
                        key={yAxisTick}
                        x1={xAxisFn(xAxisTicks[0])}
                        y1={yAxisFn(yAxisTick)}
                        x2={xAxisFn(xAxisTicks[xAxisTicks.length - 1])}
                        y2={yAxisFn(yAxisTick)}
                        stroke="#cfcfcf"
                    />
                    {/* {(yAxisTicks.length - index) % yTickInterval === 0 && ( */}
                    <text
                        className="tick-text"
                        fontSize={fontSize}
                        x={xAxisFn(xAxisTicks[0]) - yTickWidth}
                        y={yAxisFn(yAxisTick) + fontSize / 2}
                    >
                        {label(yAxisTick)}
                    </text>
                    {/* )} */}
                </React.Fragment>
            ))}
        </g>
    );
};
export default YAxis;
