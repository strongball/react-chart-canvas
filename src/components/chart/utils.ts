import { DataValue } from './types';
/**
 * start: ticks[0] px.
 * end: ticks[-1]px.
 */
interface TicksToPxFactoryParams {
    ticks: DataValue[];
    start: number;
    end: number;
    map?: Map<DataValue, number>;
}
type TicksToPxFn = (target: DataValue) => number;
export function ticksToPxFactory({ ticks, start, end, map }: TicksToPxFactoryParams): TicksToPxFn {
    if (ticks.length === 0) {
        return () => 0;
    }
    const length = end - start;
    if (typeof ticks[0] === 'number') {
        // numeral
        const min: number = ticks[0];
        const max: number = ticks[ticks.length - 1] as number;
        //  start + ((target as number) - min) * (length / (max - min));
        const fixedValue = length / (max - min);
        return (target) => start + ((target as number) - min) * fixedValue;
    } else {
        const tickHeight = length / (ticks.length - 1);
        const map = new Map(ticks.map((tick, index) => [tick, index]));
        return (target) => start + (map.get(target) ?? 0) * tickHeight;
    }
}
interface PxToTickParams {
    target: number;
    ticks: DataValue[];
    start: number;
    end: number;
}
export function pxToTick({ target, ticks, start, end }: PxToTickParams): DataValue | null {
    const length = end - start;
    // (result - min) / offsetY = (max - min) / length,
    // result = (max - min) / length * offsetY + min
    if (typeof target === 'number' && typeof ticks[0] === 'number') {
        const startValue: number = ticks[0];
        const endValue: number = ticks[ticks.length - 1] as number;
        const value = ((endValue - startValue) / length) * (target - start) + startValue;
        if (
            !(endValue > startValue ? isBetween(value, startValue, endValue) : isBetween(value, endValue, startValue))
        ) {
            return null;
        }
        return value;
    } else {
        const startValue: number = 0;
        const endValue: number = ticks.length - 1;
        const index = Math.round(((endValue - startValue) / length) * (target - start) + startValue);
        if (!isBetween(index, startValue, endValue)) {
            return null;
        }
        return ticks[index];
    }
}

function isBetween(target: number, start: number, end: number) {
    return target >= start && target <= end;
}
