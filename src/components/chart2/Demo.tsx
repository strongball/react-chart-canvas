import React, { useEffect, useRef, useState } from 'react';
import { getStock, StockData } from '../../api/stock';
import { Candlesticks } from './Candlesticks';

interface Props {
    symbol?: string;
    data?: StockData[];
}
const Demo: React.FC<Props> = (props) => {
    const { symbol, data } = props;
    const canvas = useRef<HTMLCanvasElement>(null);
    // const [chartInstance, setChartInstance] = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!data) {
            return;
        }
        const a = new Candlesticks({
            canvas: canvas.current!,
            padding: 10,
            gridScale: 2,
            gridColor: '#DBDBDB',
            bullColor: '#3D92FA',
            bearColor: '#FB6C64',
        });
        a.draw(symbol ?? '', data);
    }, [data]);
    return (
        <div>
            <canvas
                style={{ border: 1, borderColor: 'black', borderStyle: 'solid' }}
                ref={canvas}
                width={700}
                height={350}
            ></canvas>
        </div>
    );
};
export default Demo;
