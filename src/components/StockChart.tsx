import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import numeral from 'numeral';

import { StockData } from '../api/stock';
import BaseChart from './chart/BaseChart';
import { Point, DataValue } from './chart/types';
import Bar from './chart/Bar';
import XAxis from './chart/XAxis';
import YAxis from './chart/YAxis';
import Tooltip from './chart/Tooltip';
import KBar from './chart/KBar';

import { useZoomControl } from '../hooks/zoom';
import { useSwipeControl } from '../hooks/swipe';

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

    const dateStart = dayjs(date)
        .add(-displayDay / 2, 'day')
        .format('YYYY-MM-DD');
    const dateEnd = dayjs(date)
        .add(displayDay / 2, 'day')
        .format('YYYY-MM-DD');

    const inTimeStocks = useMemo<StockData[]>(
        () =>
            data?.filter((stock) => {
                const date = dayjs(stock.date);
                return !date.isBefore(dateStart) && !date.isAfter(dateEnd);
            }) || [],
        [data, dateStart, dateEnd]
    );

    const xAxisTicks: DataValue[] = useMemo(() => {
        const dates: string[] = [];
        let cursor = dayjs(dateStart);
        while (!cursor.isAfter(dateEnd)) {
            const date = cursor.format('YYYY-MM-DD');
            if (data?.some((stock) => stock.date === date)) {
                // 有開盤
                dates.push(date);
            }
            cursor = cursor.add(1, 'day');
        }
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

        const minTick = min - gap * 0.4;
        const maxTick = max + gap * 0.4;
        const interval = (maxTick - minTick) / 5;
        const ticks: number[] = [];
        let cursor = maxTick;
        while (cursor >= minTick) {
            ticks.push(Math.round(cursor * 100) / 100);
            cursor -= interval;
        }
        ticks.push(Math.round(cursor * 100) / 100);
        // add head and tail
        return ticks;
    }, [inTimeStocks]);

    const volumeYAxisTicks: DataValue[] = useMemo(() => {
        if (inTimeStocks.length === 0) {
            return [];
        }
        const volumes = inTimeStocks.map((pp) => pp.volume as number);

        const min = Math.round(Math.min(...volumes) * 0.1);
        const max = Math.round(Math.max(...volumes) * 1.1);
        const interval = Math.round((max - min) / 5);
        const ticks: number[] = [];
        let cursor = max;
        while (cursor >= min) {
            ticks.push(cursor);
            cursor -= interval;
        }
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
    const swipeEvent = useSwipeControl({
        onSwipe(value) {
            const changeValue = Math.round(value / 10);
            const targetDay = dayjs(date).add(-changeValue, 'day');
            if (!targetDay.isBefore(minAllowDate) && !targetDay.isAfter(maxAllowDate)) {
                // last day is today.
                onDateChange && onDateChange(targetDay.format('YYYY-MM-DD'));
                return;
            }
        },
    });
    return (
        <div>
            <BaseChart
                width={width}
                height={(height / 3) * 2}
                xAxisTicks={xAxisTicks}
                yAxisTicks={priceYAxisTicks}
                yTickWidth={30}
                DivProps={{
                    ...zoomEvent,
                    ...swipeEvent,
                    onTouchMove(e) {
                        zoomEvent?.onTouchMove && zoomEvent?.onTouchMove(e);
                        swipeEvent?.onTouchMove && swipeEvent?.onTouchMove(e);
                    },
                }}
            >
                <XAxis />
                <YAxis label={(data) => Number(data).toFixed(2)} />
                {/* <Line data={inTimeStocks} x="date" y="close" /> */}
                <KBar data={inTimeStocks} />
                <Tooltip render={(data: StockData) => <TooltipContent data={data} />} />
            </BaseChart>
            <BaseChart
                width={width}
                height={height / 3}
                xAxisTicks={xAxisTicks}
                yAxisTicks={volumeYAxisTicks}
                yTickWidth={30}
                DivProps={{
                    ...zoomEvent,
                    ...swipeEvent,
                    onTouchMove(e) {
                        zoomEvent?.onTouchMove && zoomEvent?.onTouchMove(e);
                        swipeEvent?.onTouchMove && swipeEvent?.onTouchMove(e);
                    },
                }}
            >
                <YAxis label={(data) => numeral(data).format('0 a')} />
                <Bar
                    data={inTimeStocks}
                    x="date"
                    y="volume"
                    color={(data) => (data.close >= data.open ? 'green' : 'red')}
                />
                <Tooltip render={(data: StockData) => <TooltipContent data={data} />} />
            </BaseChart>
        </div>
    );
};

const TooltipContent: React.FC<{ data: StockData }> = (props) => {
    const { data } = props;
    return (
        <div>
            <div>{`Date: ${data.date}`}</div>
            <div>{`Open: ${data.open}`}</div>
            <div>{`High: ${data.high}`}</div>
            <div>{`Low: ${data.low}`}</div>
            <div>{`Close: ${data.close}`}</div>
            <div>{`Volume: ${data.volume}`}</div>
        </div>
    );
};
export default StockChart;
