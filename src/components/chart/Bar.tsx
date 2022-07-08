import React, { PropsWithChildren, useContext } from 'react';
import { DataValue, OnlyDataValueKey, Point } from './types';
import { ChartContext } from './context';

interface Props<T extends {}> {
    data: T[];
    x: OnlyDataValueKey<T>;
    y: OnlyDataValueKey<T>;
    color?: string | ((data: T) => string);
}
const Bar = <T,>(props: PropsWithChildren<Props<T>>) => {
    const { data, x, y, color } = props;
    const { xAxisFn, yAxisFn, yAxisTicks, onHoverItem } = useContext(ChartContext);
    const baseY = yAxisFn(yAxisTicks[yAxisTicks.length - 1]);
    const barWidth = 10;

    const colorFn = typeof color === 'function' ? color : () => color;
    return (
        <g className="line">
            {data.map((item, i) => (
                <React.Fragment key={i}>
                    <rect
                        x={xAxisFn(item[x] as unknown as number) - barWidth / 2}
                        y={yAxisFn(item[y] as unknown as DataValue)}
                        width={barWidth}
                        height={baseY - yAxisFn(item[y] as unknown as DataValue)}
                        fill={colorFn(item)}
                        onMouseEnter={(e) =>
                            onHoverItem({
                                x: e.clientX,
                                y: e.clientY,
                                data: item,
                            })
                        }
                        onMouseLeave={() => onHoverItem()}
                    />
                </React.Fragment>
            ))}
        </g>
    );
};
export default Bar;
