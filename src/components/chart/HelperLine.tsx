import React, { useContext } from 'react';
import { ChartContext } from './context';
import { DataValue, Point } from './types';

interface Props {
    fontSize?: number;
    label?: (value: DataValue) => string;
    point?: Point;
}
const HelperLine: React.FC<Props> = (props) => {
    const { fontSize = 8, label = (v) => v.toString(), point } = props;
    const { render, content, xAxisFn, yAxisFn, yTickWidth, yTickPosition } = useContext(ChartContext);

    if (render && point) {
        const x = xAxisFn(point.x);
        const y = yAxisFn(point.y);
        render.drawLine(
            { x: content.x, y: y },
            { x: content.x + content.width, y: y },
            { strokeStyle: 'green', lineDash: [5, 5] }
        );
        render.drawLine(
            { y: content.y, x: x },
            { y: content.y + content.height, x: x },
            { strokeStyle: 'green', lineDash: [5, 5] }
        );

        // test
        const textPadding = 10;
        const labelTextX = yTickPosition === 'left' ? textPadding : content.x + content.width + textPadding;

        render.drawRect({
            x: labelTextX - textPadding,
            y: yAxisFn(point.y) - fontSize,
            width: yTickWidth,
            height: fontSize * 2,
            color: 'green',
        });
        render.drawText(
            label(point.y),
            { x: labelTextX, y: yAxisFn(point.y) + fontSize / 2 },
            { font: `${fontSize}px`, fillStyle: 'white' }
        );
    }
    return null;
};
export default HelperLine;
