import { APIResult } from './data';

interface Options {
    canvas: HTMLCanvasElement;
    padding: number;
    gridScale: number;
    gridColor: string;
    bullColor: string;
    bearColor: string;
    data: APIResult;
}
export class Candlesticks {
    options: Options;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    timeSeries: any;
    symbol: string;
    scale: number;
    properties: any;
    candleWidth: number;
    constructor(options: Options) {
        // options to receive in form of an object.
        this.options = options;
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext('2d')!;
        this.timeSeries = options.data['Time Series (Daily)'];
        this.symbol = options.data['Meta Data']['Symbol'];
        this.scale = options.gridScale;
        this.properties = Object.values(this.timeSeries).reverse();
        this.candleWidth = 5;
    }
    // create an array of properties from timeSeries
    arrOfAllPrices = (array: any) => {
        const output: any[] = [];
        for (let i = 0; i < array.length; i++) {
            for (let price in array[i]) {
                // we don't want to include volume data
                if (price !== 'volume') {
                    output.push(array[i][price]);
                }
            }
        }
        return output;
    };

    // helper function for drawing a solid line on canvas.
    drawLine = (ctx, startX, startY, endX, endY, color) => {
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        this.ctx.restore();
    };

    // helper function to draw a candle:
    drawCandle = (ctx, upperLeftCornerX, upperLeftCornerY, width, height, color) => {
        this.ctx.save();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(upperLeftCornerX, upperLeftCornerY, width, height);
        this.ctx.restore();
    };

    // candle color helper function:
    candleColor = (currentClose, currentOpen) => {
        let color;
        let close = Number.parseFloat(currentClose);
        let open = Number.parseFloat(currentOpen);

        if (close > open) {
            color = this.options.bullColor;
        } else if (open > close) {
            color = this.options.bearColor;
        } else {
            color = 'black';
        }
        return color;
    };

    draw() {
        const prices = this.arrOfAllPrices(this.properties);
        // determine Maximum value of price on Y axis:
        // We want the lowest/highest price from our list of prices first:
        let min = Math.min(...prices);
        let max = Math.max(...prices);
        // round up the above min and max grid markers so that we can use that number for plotting our grid.
        // rounded to the nearest determined scale.
        let gridMin = Math.round(min / this.scale) * this.scale;
        let gridMax = Math.round(max / this.scale) * this.scale;

        const canvasActualHeight = this.canvas.height - this.options.padding * 2;
        const canvasActualWidth = this.canvas.width;

        // draw a grid
        let axisInterval = (gridMax - gridMin) / this.scale;
        let gridValue = gridMin;
        let counter = 0;
        while (gridValue <= gridMax) {
            let gridY = canvasActualHeight * (1 - counter / axisInterval) + this.options.padding;
            this.drawLine(this.ctx, 0, gridY, this.canvas.width, gridY, this.options.gridColor);

            // Plot the candles.
            let gridDifference = gridMax - gridMin;
            let openPrice, closePrice, highPrice, lowPrice, candleColor;
            let xCounter = 27;
            let coordinateX, coordinateY, height;

            let drawWicks = (ctx, coordinateX, open, high, close, low, candleColor) => {
                let highPriceY = canvasActualHeight * ((gridMax - high) / gridDifference) + this.options.padding;
                let lowPriceY = canvasActualHeight * ((gridMax - low) / gridDifference) + this.options.padding;
                let startY, endY;

                if (candleColor === this.options.bullColor) {
                    startY = close;
                    endY = highPriceY;
                } else {
                    startY = open;
                    endY = highPriceY;
                }

                this.ctx.save();
                this.ctx.strokeStyle = 'black';
                this.ctx.beginPath();
                this.ctx.moveTo(coordinateX + 2.5, startY);
                this.ctx.lineTo(coordinateX + 2.5, endY);
                this.ctx.stroke();
                this.ctx.restore();

                if (candleColor === this.options.bullColor) {
                    startY = open;
                    endY = lowPriceY;
                } else {
                    startY = close;
                    endY = lowPriceY;
                }

                this.ctx.save();
                this.ctx.strokeStyle = 'black';
                this.ctx.beginPath();
                this.ctx.moveTo(coordinateX + 2.5, startY);
                this.ctx.lineTo(coordinateX + 2.5, endY);
                this.ctx.stroke();
                this.ctx.restore();
            };

            for (let i = 0; i < this.properties.length; i++) {
                openPrice = Number.parseFloat(this.properties[i].open);
                closePrice = Number.parseFloat(this.properties[i].close);
                highPrice = Number.parseFloat(this.properties[i].high);
                lowPrice = Number.parseFloat(this.properties[i].low);
                candleColor = this.candleColor(closePrice, openPrice);
                let closePriceY = canvasActualHeight * ((gridMax - closePrice) / gridDifference) + this.options.padding;
                let openPriceY = canvasActualHeight * ((gridMax - openPrice) / gridDifference) + this.options.padding;

                coordinateX = canvasActualWidth * ((i + 1) / 100) + xCounter;
                coordinateY = candleColor === (this.options as any).bullCandle ? closePriceY : openPriceY;

                if (candleColor === this.options.bullColor) {
                    height = closePriceY - openPriceY;
                } else if (candleColor === this.options.bearColor) {
                    height = (openPriceY - closePriceY) * -1;
                } else {
                    height = 1;
                }
                height = Number.parseFloat(height.toFixed(1));

                this.drawCandle(this.ctx, coordinateX, coordinateY, this.candleWidth, height, candleColor);
                drawWicks(this.ctx, coordinateX, openPriceY, highPrice, closePriceY, lowPrice, candleColor);

                xCounter += 1;
            }

            // writing grid markers
            this.ctx.save();
            this.ctx.fillStyle = 'grey';
            this.ctx.font = 'bold 10px Arial';
            this.ctx.fillText(`${gridValue.toFixed(2)}`, 0, gridY - 2);
            this.ctx.restore();

            gridValue += this.options.gridScale;
            counter += 1;
        }
        // filling in the symbol text on chart
        this.ctx.save();
        this.ctx.fillStyle = '#ebeff4';
        this.ctx.font = 'bold 100px Arial';
        this.ctx.fillText(this.symbol, 200, this.canvas.height / 2);
        this.ctx.restore();
    }
}
