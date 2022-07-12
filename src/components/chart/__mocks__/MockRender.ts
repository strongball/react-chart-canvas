import { DrawLineOptions, DrawRectOptions, DrawTextOptions, Options, Position, RenderBackend } from '../CanvasRender';

interface MockSymbol {
    type: string;
    payload: any;
}
export class MockRender implements RenderBackend {
    symbols: MockSymbol[] = [];
    constructor() {}
    // helper function for drawing a solid line on canvas.
    drawLine(...args) {
        this.symbols.push({
            type: 'line',
            payload: args,
        });
    }

    // helper function to draw a rect:
    drawRect(...args) {
        this.symbols.push({
            type: 'rect',
            payload: args,
        });
    }
    // helper function to draw a text:
    drawText(...args) {
        this.symbols.push({
            type: 'text',
            payload: args,
        });
    }
    clear() {
        this.symbols = [];
    }
    getSymbolsByType(type: string): MockSymbol[] {
        return this.symbols.filter((symbol) => symbol.type === type);
    }
}
