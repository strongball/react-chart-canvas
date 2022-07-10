import dayjs from 'dayjs';
import React, { useMemo } from 'react';

import { StockData } from '../api/stock';
import BaseChart from './chart/BaseChart';
import { DataValue } from './chart/types';
import XAxis from './chart/XAxis';
import YAxis from './chart/YAxis';
import Candlestick from './chart/Candlestick';

import { useZoomControl } from '../hooks/zoom';
import { useSwipeControl } from '../hooks/swipe';
import HelperLine from './chart/HelperLine';

function priceRound(value: number): number {
    return Math.round(value * 2) / 2;
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
    const { width, height, data, date, onDateChange, displayDay, onDisplayDayChange } = props;

    const dateStart = dayjs(date).add(-displayDay, 'day').format('YYYY-MM-DD');
    const dateEnd = dayjs(date).format('YYYY-MM-DD');
    const inTimeStocks = useMemo<StockData[]>(
        () =>
            data?.filter((stock) => {
                const date = dayjs(stock.date);
                return !date.isBefore(dateStart) && !date.isAfter(dateEnd);
            }) || [],
        [data, dateStart, dateEnd]
    );

    /**
     * date between dateStart, dateEnd
     */
    const xAxisTicks: DataValue[] = useMemo(() => {
        const dates: string[] = inTimeStocks.map((item) => item.date).reverse();
        return dates;
    }, [dateStart, dateEnd, data]);
    const priceYAxisTicks: DataValue[] = useMemo(() => {
        if (inTimeStocks.length === 0) {
            return [];
        }
        const prices = inTimeStocks.map((pp) => [pp.high, pp.low]).flat();

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
    }, [inTimeStocks]);

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
            const targetDay = dayjs(date).add(value > 0 ? -1 : 1, 'day');
            if (!targetDay.isBefore(minAllowDate) && !targetDay.isAfter(maxAllowDate)) {
                onDateChange && onDateChange(targetDay.format('YYYY-MM-DD'));
                return;
            }
        },
        threshold: tickWidth,
    });
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
            >
                <XAxis line={false} />
                <YAxis label={(data) => Number(data).toFixed(2)} />
                <HelperLine label={(data) => Number(data).toFixed(2)} />
                <Candlestick data={inTimeStocks} />
            </BaseChart>
        </div>
    );
};
export default StockChart;
