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
const Candlestick = (props: PropsWithChildren<Props>) => {
    const { data, barWidth = 10 } = props;
    const { render, content, xAxisFn, yAxisFn, xAxisTicks } = useContext(ChartContext);
    const eachStickWidth = content.width / xAxisTicks.length;
    const limitedBarWidth = Math.min(barWidth, eachStickWidth);
    return (
        <>
            {render &&
                data.map((item, i) => {
                    const x = xAxisFn(item.date);
                    const openY = yAxisFn(item.open);
                    const highY = yAxisFn(item.high);
                    const lowY = yAxisFn(item.low);
                    const closeY = yAxisFn(item.close);
                    const rectTop = Math.min(openY, closeY);
                    const rectHeight = Math.abs(openY - closeY);
                    const color = item.close >= item.open ? 'green' : 'red';
                    render.drawLine({ x: x, y: highY }, { x: x, y: lowY }, { strokeStyle: 'color' });

                    return render.drawRect({
                        x: x - limitedBarWidth / 2,
                        y: rectTop,
                        width: limitedBarWidth,
                        height: rectHeight,
                        color: color,
                    });
                })}
        </>
    );
};
export default Candlestick;
