import React, { PropsWithChildren, useContext } from 'react';
import { DataValue, OnlyDataValueKey, Point } from './types';
import { ChartContext } from './context';

interface KBarData {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
}
interface Props {
    data: KBarData[];
    barWidth?: number;
}
const KBar = (props: PropsWithChildren<Props>) => {
    const { data, barWidth = 10 } = props;
    const { xAxisFn, yAxisFn, yAxisTicks, onHoverItem } = useContext(ChartContext);
    const baseY = yAxisFn(yAxisTicks[yAxisTicks.length - 1]);
    return (
        <g className="line">
            {data.map((item, i) => {
                const x = xAxisFn(item.date);
                const openY = yAxisFn(item.open);
                const highY = yAxisFn(item.high);
                const lowY = yAxisFn(item.low);
                const closeY = yAxisFn(item.close);
                const rectTop = Math.min(openY, closeY);
                const rectHeight = Math.abs(openY - closeY);
                const color = item.close >= item.open ? 'green' : 'red';
                return (
                    <React.Fragment key={i}>
                        <rect
                            x={x - barWidth / 2}
                            y={rectTop}
                            width={barWidth}
                            height={rectHeight}
                            fill={color}
                            onMouseEnter={(e) =>
                                onHoverItem({
                                    x: e.clientX,
                                    y: e.clientY,
                                    data: item,
                                })
                            }
                            onMouseLeave={() => onHoverItem()}
                        />
                        <line x1={x} y1={highY} x2={x} y2={lowY} stroke={color} strokeWidth={2} />
                    </React.Fragment>
                );
            })}
        </g>
    );
};
export default KBar;
