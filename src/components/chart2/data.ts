export interface StockData {
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
}
export interface APIResult {
    'Meta Data': {
        Symbol: string;
    };
    'Time Series (Daily)': {
        [D: string]: StockData;
    };
}
export const data: APIResult = {
    'Meta Data': {
        // Information: 'Daily Prices (open, high, low, close) and Volumes',
        Symbol: 'MSFT',
        // 'Last Refreshed': '2018-08-06',
        // 'Output Size': 'Compact',
        // 'Time Zone': 'US/Eastern',
    },
    'Time Series (Daily)': {
        '2018-06-25': {
            open: '100.0000',
            high: '100.1100',
            low: '97.3000',
            close: '98.3900',
            volume: '35433333',
        },
        '2018-06-22': {
            open: '100.4100',
            high: '100.7700',
            low: '99.6250',
            close: '100.4100',
            volume: '38923105',
        },
        '2018-06-21': {
            open: '102.0750',
            high: '102.4600',
            low: '100.8800',
            close: '101.1400',
            volume: '23198188',
        },
        '2018-06-20': {
            open: '101.3700',
            high: '102.5200',
            low: '101.1200',
            close: '101.8700',
            volume: '26180792',
        },
        '2018-06-19': {
            open: '99.6500',
            high: '101.0000',
            low: '99.5000',
            close: '100.8600',
            volume: '28653087',
        },
        '2018-06-18': {
            open: '100.0100',
            high: '101.1100',
            low: '99.4200',
            close: '100.8600',
            volume: '23586037',
        },
        '2018-06-15': {
            open: '101.5100',
            high: '101.5300',
            low: '100.0700',
            close: '100.1300',
            volume: '65738585',
        },
    },
};
