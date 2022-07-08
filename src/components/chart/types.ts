export type DataValue = string | number;

export interface Point {
    x: DataValue;
    y: DataValue;
}

export type OnlyDataValueKey<T> = { [K in keyof T]: T[K] extends DataValue ? K : never }[keyof T];
