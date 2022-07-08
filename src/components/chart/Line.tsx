import React, { PropsWithChildren, useContext } from 'react';
import { DataValue, OnlyDataValueKey } from './types';
import { ChartContext } from './context';

interface Props<T extends {}> {
    data: T[];
    x: OnlyDataValueKey<T>;
    y: OnlyDataValueKey<T>;
}
const Line = <T,>(props: PropsWithChildren<Props<T>>) => {
    const { data, x, y } = props;
    const { xAxisFn, yAxisFn, onHoverItem } = useContext(ChartContext);
    return (
        <g className="line">
            {data.map((point, i) => (
                <React.Fragment key={i}>
                    {i !== 0 && (
                        <line
                            x1={xAxisFn(data[i - 1][x] as unknown as number)}
                            y1={yAxisFn(data[i - 1][y] as unknown as DataValue)}
                            x2={xAxisFn(point[x] as unknown as number)}
                            y2={yAxisFn(point[y] as unknown as DataValue)}
                            stroke="blue"
                        />
                    )}
                    <circle
                        cx={xAxisFn(point[x] as unknown as number)}
                        cy={yAxisFn(point[y] as unknown as DataValue)}
                        r={4}
                        fill="blue"
                        onMouseEnter={(e) =>
                            onHoverItem({
                                x: e.clientX,
                                y: e.clientY,
                                data: point,
                            })
                        }
                        onMouseLeave={() => onHoverItem()}
                    />
                </React.Fragment>
            ))}
        </g>
    );
};
export default Line;
