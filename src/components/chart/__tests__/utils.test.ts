import { pxToTick, ticksToPxFactory } from '../utils';

describe('ticksToPxFactory', () => {
    it('Series', () => {
        expect(
            ticksToPxFactory({
                start: 0,
                end: 100,
                ticks: [0, 10, 20, 100],
            })(50)
        ).toBe(50);
    });
    it('Category', () => {
        expect(
            ticksToPxFactory({
                start: 0,
                end: 100,
                ticks: ['A', 'B', 'C', 'D', 'E'],
            })('B')
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
