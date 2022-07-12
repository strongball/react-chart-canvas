import { pxToTick, ticksToPx } from '../utils';

describe('ticksToPx', () => {
    it('Series', () => {
        expect(
            ticksToPx({
                start: 0,
                end: 100,
                target: 50,
                ticks: [0, 10, 20, 100],
            })
        ).toBe(50);
    });
    it('Category', () => {
        expect(
            ticksToPx({
                start: 0,
                end: 100,
                target: 'B',
                ticks: ['A', 'B', 'C', 'D', 'E'],
            })
        ).toBe(25);
    });
});
describe('pxToTick', () => {
    it('Series', () => {
        expect(
            pxToTick({
                start: 0,
                end: 100,
                target: 50,
                ticks: [0, 10, 20, 100],
            })
        ).toBe(50);
    });
    it('Category', () => {
        expect(
            pxToTick({
                start: 0,
                end: 100,
                target: 25,
                ticks: ['A', 'B', 'C', 'D', 'E'],
            })
        ).toBe('B');
    });
});
