import React, { useEffect, useRef } from 'react';
import { Candlesticks } from './Candlesticks';
import { data } from './data';

interface Props {}
const Demo: React.FC<Props> = (props) => {
    const canvas = useRef<HTMLCanvasElement>(null);
    // const [chartInstance, setChartInstance] = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const a = new Candlesticks({
            canvas: canvas.current!,
            padding: 10,
            gridScale: 1,
            gridColor: '#DBDBDB',
            bullColor: '#3D92FA',
            bearColor: '#FB6C64',
            data: data,
        });
        a.draw();
    }, []);
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
