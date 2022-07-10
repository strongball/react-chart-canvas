export type DataValue = string | number;

export interface Point {
    x: DataValue;
    y: DataValue;
}
export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface Padding {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export type OnlyDataValueKey<T> = { [K in keyof T]: T[K] extends DataValue ? K : never }[keyof T];
