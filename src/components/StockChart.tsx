import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';

import { StockData } from '../api/stock';
import BaseChart from './chart/BaseChart';
import { DataValue, Point } from './chart/types';
import XAxis from './chart/XAxis';
import YAxis from './chart/YAxis';
import Candlestick from './chart/Candlestick';

import { useZoomControl } from '../hooks/zoom';
import { useSwipeControl } from '../hooks/swipe';
import HelperLine from './chart/HelperLine';

function priceRound(value: number): number {
    const base = 0.5;
    return Math.round(value / base) * base;
}
interface Props {
    width: number;
    height: number;
    date: string;
    onDateChange?: (date: string) => void;
    displayDay: number;
    onDisplayDayChange?: (displayDay: number) => void;
    data?: StockData[];
}
const StockChart: React.FC<Props> = (props) => {
    const { width, height, data = [], date, onDateChange, displayDay, onDisplayDayChange } = props;

    const inChartStocks = useMemo<StockData[]>(() => {
        const stocks: StockData[] = [];
        for (let i = 0; i < data.length && stocks.length < displayDay; i++) {
            if (data[i].date <= date) {
                stocks.push(data[i]);
            }
        }
        return stocks;
    }, [data, date, displayDay]);

    /**
     * date between dateStart, dateEnd
     */
    const xAxisTicks: DataValue[] = useMemo(() => {
        const dates: string[] = inChartStocks.map((item) => item.date).reverse();
        return dates;
    }, [inChartStocks]);
    const priceYAxisTicks: DataValue[] = useMemo(() => {
        if (inChartStocks.length === 0) {
            return [];
        }
        const prices = inChartStocks.map((pp) => [pp.high, pp.low]).flat();

        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const gap = max - min;

        const minTick = Math.max(min - gap * 0.2, 0);
        const maxTick = max + gap * 0.2;
        const interval = (maxTick - minTick) / 5;
        const ticks: number[] = [];
        let cursor = minTick;
        while (cursor <= maxTick) {
            ticks.push(priceRound(cursor));
            cursor += interval;
        }
        ticks.push(Math.max(priceRound(cursor), 0));
        // add head and tail
        return ticks;
    }, [inChartStocks]);

    const zoomEvent = useZoomControl({
        onZoomChange(value) {
            const newDisplayDay = Math.min(Math.max(6, displayDay + Math.round(value / 20)), data?.length || Infinity);
            onDisplayDayChange && onDisplayDayChange(newDisplayDay);
        },
    });

    /**
     * move
     */
    const minAllowDate = data?.[data.length - 1].date;
    const maxAllowDate = data?.[0].date;
    const tickWidth = width / displayDay;
    const swipeEvent = useSwipeControl({
        onSwipe(value) {
            const targetDay = dayjs(date).add(Math.round(-value / tickWidth), 'day');
            if (!targetDay.isBefore(minAllowDate) && !targetDay.isAfter(maxAllowDate)) {
                onDateChange && onDateChange(targetDay.format('YYYY-MM-DD'));
                return;
            }
        },
        threshold: tickWidth,
    });
    // hover
    const [hover, setHover] = useState<Point>();
    const onHover = (point?: Point) => {
        if (!point) {
            setHover(undefined);
        } else {
            const x = point.x;
            const y = priceRound(point.y as number);
            if (!hover || x !== hover.x || y !== hover.y) {
                setHover({ x, y });
            }
        }
    };
    return (
        <div>
            <BaseChart
                width={width}
                height={height}
                xAxisTicks={xAxisTicks}
                yAxisTicks={priceYAxisTicks}
                xTickHeight={10}
                yTickWidth={50}
                yTickPosition="right"
                DivProps={{
                    ...zoomEvent,
                    ...swipeEvent,
                    onTouchMove(e) {
                        zoomEvent?.onTouchMove && zoomEvent?.onTouchMove(e);
                        swipeEvent?.onTouchMove && swipeEvent?.onTouchMove(e);
                    },
                }}
                onHover={onHover}
            >
                <XAxis line={false} maxTickCount={Math.round(width / 80)} />
                <YAxis label={(data) => Number(data).toFixed(2)} />
                <HelperLine label={(data) => Number(data).toFixed(2)} point={hover} />
                <Candlestick data={inChartStocks} />
            </BaseChart>
        </div>
    );
};
export default StockChart;
