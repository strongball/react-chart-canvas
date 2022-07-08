import { StockData } from '../../api/stock';

interface Options {
    canvas: HTMLCanvasElement;
    padding: number;
    gridScale: number;
    gridColor: string;
    bullColor: string;
    bearColor: string;
}
interface Position {
    x: number;
    y: number;
}
interface DrawRectOptions {
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
}
interface DrawTextOptions {
    fillStyle?: string;
    font?: string;
}
interface DrawLineOptions {
    color?: string;
    strokeStyle?: string;
}
export class Candlesticks {
    options: Options;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    scale: number;
    candleWidth: number;
    constructor(options: Options) {
        // options to receive in form of an object.
        this.options = options;
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext('2d')!;
        this.scale = options.gridScale;
        this.candleWidth = 5;
    }
    // helper function for drawing a solid line on canvas.
    drawLine(start: Position, end: Position, { color, strokeStyle }: DrawLineOptions = {}) {
        this.ctx.save();
        color && (this.ctx.strokeStyle = color);
        strokeStyle && (this.ctx.strokeStyle = strokeStyle);
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
        this.ctx.restore();
    }

    // helper function to draw a candle:
    drawCandle(upperLeftCornerX, upperLeftCornerY, width, height, color) {
        this.ctx.save();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(upperLeftCornerX, upperLeftCornerY, width, height);
        this.ctx.restore();
    }

    // helper function to draw a rect:
    drawRect({ x, y, width, height, color }: DrawRectOptions) {
        this.ctx.save();
        color && (this.ctx.fillStyle = color);
        this.ctx.fillRect(x, y, width, height);
        this.ctx.restore();
    }
    // candle color helper function:
    candleColor(currentClose, currentOpen) {
        let color: string;
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
    }
    // helper function to draw a text:
    drawText(text: string, position: Position, { fillStyle, font }: DrawTextOptions = {}) {
        this.ctx.save();
        fillStyle && (this.ctx.fillStyle = fillStyle);
        font && (this.ctx.font = font);
        this.ctx.fillText(text, position.x, position.y);
        this.ctx.restore();
    }
    clear() {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }
    draw(symbol: string, stocks: StockData[]) {
        this.clear();
        const prices = stocks.map((row) => [row.open, row.high, row.low, row.close]).flat();
        // determine Maximum value of price on Y axis:
        // We want the lowest/highest price from our list of prices first:
        let min = Math.min(...prices);
        let max = Math.max(...prices);
        // round up the above min and max grid markers so that we can use that number for plotting our grid.
        // rounded to the nearest determined scale.
        let gridMin = Math.round(min / this.scale) * this.scale;
        let gridMax = Math.round(max / this.scale) * this.scale;

        /**
         * yAxis
         */
        let axisInterval = (gridMax - gridMin) / this.scale;
        const canvasActualHeight = this.canvas.height - this.options.padding * 2;
        const priceToYAxis = (price: number) => {
            return canvasActualHeight * ((gridMax - price) / axisInterval) + this.options.padding;
        };

        /**
         * xAxis
         */
        let maxItem = 20;
        const tickPadding = 30;
        const canvasActualWidth = this.canvas.width - tickPadding;
        const indexToXAxis = (index: number) => {
            return canvasActualWidth * ((index + 1) / maxItem) + tickPadding;
        };
        // start draw
        // filling in the symbol text on chart
        this.drawText(
            symbol,
            { x: 200, y: this.canvas.height / 2 },
            { fillStyle: '#ebeff4', font: 'bold 100px Arial' }
        );
        let gridValue = gridMin;
        while (gridValue <= gridMax) {
            let gridY = priceToYAxis(gridValue);
            this.drawLine({ x: 0, y: gridY }, { x: this.canvas.width, y: gridY }, { color: this.options.gridColor });
            // writing grid markers
            this.drawText(
                `${gridValue.toFixed(2)}`,
                { x: 0, y: gridY - 2 },
                { fillStyle: 'grey', font: 'bold 10px Arial' }
            );
            gridValue += this.options.gridScale;
        }
        // Plot the candles.
        for (let i = 0; i < stocks.length; i++) {
            const stock = stocks[i];
            const candleColor = this.candleColor(stock.close, stock.open);
            let closePriceY = priceToYAxis(stock.close);
            let openPriceY = priceToYAxis(stock.open);
            let highPriceY = priceToYAxis(stock.high);
            let lowPriceY = priceToYAxis(stock.low);
            const coordinateX = indexToXAxis(i);
            const coordinateY = Math.min(closePriceY, openPriceY);
            const height = Math.max(Math.abs(closePriceY - openPriceY), 1); // Number.parseFloat(height.toFixed(1));

            this.drawLine(
                { x: coordinateX, y: highPriceY },
                { x: coordinateX, y: lowPriceY },
                { strokeStyle: 'black' }
            );
            // this.drawCandle(coordinateX, coordinateY, this.candleWidth, height, candleColor);
            this.drawRect({
                x: coordinateX - this.candleWidth / 2,
                y: coordinateY,
                width: this.candleWidth,
                height,
                color: candleColor,
            });
        }
    }
}
