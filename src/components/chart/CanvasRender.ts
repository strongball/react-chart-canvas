interface Options {
    canvas: HTMLCanvasElement;
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
    strokeStyle?: string;
}
export class CanvasRender {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    constructor(options: Options) {
        // options to receive in form of an object.
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext('2d')!;
    }
    // helper function for drawing a solid line on canvas.
    drawLine(start: Position, end: Position, { strokeStyle }: DrawLineOptions = {}) {
        this.ctx.save();
        strokeStyle && (this.ctx.strokeStyle = strokeStyle);
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
        this.ctx.restore();
    }

    // helper function to draw a rect:
    drawRect({ x, y, width, height, color }: DrawRectOptions) {
        this.ctx.save();
        color && (this.ctx.fillStyle = color);
        this.ctx.fillRect(x, y, width, height);
        this.ctx.restore();
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
}
