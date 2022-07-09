import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { getStock } from '../api/stock';

import StockChart from '../components/StockChart';
import ReactiveDiv from '../components/ReactiveDiv';

import { Card, CardContent, Container } from '@mui/material';
import dayjs from 'dayjs';

interface Props {}
const StockPage: React.FC<Props> = (props) => {
    const [stockCode, setStockCode] = useState('AAPL');
    const [date, setDate] = useState(dayjs('2022-01-01').format('YYYY-MM-DD'));
    const [displayDay, setDisplayDay] = useState(10);
    const { data } = useSWR(stockCode, (key) => {
        if (!key) {
            return null;
        }
        return getStock(key);
    });
    useEffect(() => {
        if (data) {
            setDate(data[data.length - 1].date);
        }
    }, [data]);
    return (
        <Container>
            <Card>
                <CardContent>
                    {data ? (
                        <ReactiveDiv
                            style={{ width: '100%', height: 400 }}
                            render={({ width, height }) => (
                                <StockChart
                                    height={height}
                                    width={width}
                                    data={data}
                                    date={date}
                                    onDateChange={setDate}
                                    displayDay={displayDay}
                                    onDisplayDayChange={setDisplayDay}
                                />
                            )}
                        />
                    ) : (
                        'loading...'
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};
export default StockPage;
