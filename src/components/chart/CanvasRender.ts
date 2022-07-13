import React from 'react';

export interface Options {
    canvas: HTMLCanvasElement;
}
export interface Position {
    x: number;
    y: number;
}
export interface DrawRectOptions {
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
}
export interface DrawTextOptions {
    fillStyle?: string;
    font?: string;
}
export interface DrawLineOptions {
    lineDash?: number[];
    strokeStyle?: string;
}
export abstract class RenderBackend {
    abstract drawLine(start: Position, end: Position, options: DrawLineOptions);
    abstract drawRect(options: DrawRectOptions);
    abstract drawText(text: string, position: Position, params: DrawTextOptions);
    abstract clear();
}

export class CanvasRender implements RenderBackend {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    constructor(options: Options) {
        // options to receive in form of an object.
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext('2d')!;
    }
    // helper function for drawing a solid line on canvas.
    drawLine(start: Position, end: Position, { strokeStyle, lineDash }: DrawLineOptions = {}) {
        this.ctx.save();
        this.ctx.lineWidth = 1;
        strokeStyle && (this.ctx.strokeStyle = strokeStyle);
        lineDash && this.ctx.setLineDash(lineDash);
        this.ctx.beginPath();
        this.ctx.moveTo(start.x + 0.5, start.y + 0.5);
        this.ctx.lineTo(end.x + 0.5, end.y + 0.5);
        this.ctx.stroke();
        this.ctx.restore();
        return null;
    }

    // helper function to draw a rect:
    drawRect({ x, y, width, height, color }: DrawRectOptions) {
        this.ctx.save();
        color && (this.ctx.fillStyle = color);
        this.ctx.fillRect(x, y, width, height);
        this.ctx.restore();
        return null;
    }
    // helper function to draw a text:
    drawText(text: string, position: Position, { fillStyle, font }: DrawTextOptions = {}) {
        this.ctx.save();
        fillStyle && (this.ctx.fillStyle = fillStyle);
        font && (this.ctx.font = font);
        this.ctx.fillText(text, position.x, position.y);
        this.ctx.restore();
        return null;
    }
    clear() {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }
}
