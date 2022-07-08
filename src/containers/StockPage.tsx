import React, { useState } from 'react';
import useSWR from 'swr';
import { getStock } from '../api/stock';

import StockForm, { FormData } from '../components/StockForm';
import StockChart from '../components/StockChart';
import ReactiveDiv from '../components/ReactiveDiv';

import { Card, CardContent, Container, useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import Demo from '../components/chart2/Demo';
interface Props {}
const StockPage: React.FC<Props> = (props) => {
    // const [stockCode, setStockCode] = useState('AAPL');
    // const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    // const [displayDay, setDisplayDay] = useState(30);
    // const { data } = useSWR(stockCode, (key) => {
    //     if (!key) {
    //         return null;
    //     }
    //     return getStock(key);
    // });
    // const handleSubmit = (data: FormData) => {
    //     setStockCode(data.stockCode);
    // };
    return (
        <Container>
            <Card>
                {/* <CardContent>
                    <StockForm initValue={{ stockCode }} onSubmit={handleSubmit} />
                </CardContent> */}
                <CardContent>
                    <Demo />
                    {/* {data ? (
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
                    )} */}
                </CardContent>
            </Card>
        </Container>
    );
};
export default StockPage;
