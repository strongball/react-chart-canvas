import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { getStock } from '../api/stock';

import StockChart from '../components/StockChart';
import ReactiveDiv from '../components/ReactiveDiv';

import { Button, ButtonGroup, Card, CardContent, Container } from '@mui/material';
import dayjs from 'dayjs';

interface Props {}
const StockPage: React.FC<Props> = (props) => {
    const [stockCode, setStockCode] = useState('QQQ');
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [displayDay, setDisplayDay] = useState(100);
    const { data } = useSWR(stockCode, async (key) => {
        if (!key) {
            return null;
        }
        const data = await getStock(key);
        return data;
    });
    useEffect(() => {
        if (data) {
            const startDate = data[500].date;
            const endDate = data[0].date;
            setDisplayDay(dayjs(endDate).diff(startDate, 'day'));
            setDate(data[0].date);
        }
    }, [data]);
    return (
        <Container>
            <Card>
                <CardContent>
                    <ButtonGroup variant="outlined" aria-label="outlined button group">
                        <Button onClick={() => setDisplayDay(displayDay + 10)}>+</Button>
                        <Button onClick={() => setDisplayDay(displayDay - 10)}>-</Button>
                        <Button onClick={() => setDisplayDay(10)}>10 Day</Button>
                        <Button onClick={() => setDisplayDay(100)}>100 Day</Button>
                        <Button onClick={() => setDisplayDay(500)}>500 Day</Button>
                        <Button onClick={() => setDisplayDay(1000)}>1000 Day</Button>
                        <Button onClick={() => setDisplayDay(2000)}>2000 Day</Button>
                    </ButtonGroup>
                </CardContent>
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
