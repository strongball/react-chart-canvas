import React, { useContext } from 'react';
import { ChartContext } from './context';
import { DataValue } from './types';

interface Props {
    fontSize?: number;
    label?: (value: DataValue) => string;
}
const HelperLine: React.FC<Props> = (props) => {
    const { fontSize = 8, label = (v) => v.toString() } = props;
    const { canvasRender, content, xAxisFn, yAxisFn, hover, yTickWidth, yTickPosition } = useContext(ChartContext);
    if (canvasRender && hover) {
        const x = xAxisFn(hover.x);
        const y = yAxisFn(hover.y);
        canvasRender.drawLine(
            { x: content.x, y: y },
            { x: content.x + content.width, y: y },
            { strokeStyle: 'green', lineDash: [5, 5] }
        );
        canvasRender.drawLine(
            { y: content.y, x: x },
            { y: content.y + content.height, x: x },
            { strokeStyle: 'green', lineDash: [5, 5] }
        );

        // test
        const textPadding = 10;
        const labelTextX = yTickPosition === 'left' ? textPadding : content.x + content.width + textPadding;

        canvasRender.drawRect({
            x: labelTextX - textPadding,
            y: yAxisFn(hover.y) - fontSize,
            width: yTickWidth,
            height: fontSize * 2,
            color: 'green',
        });
        canvasRender.drawText(
            label(hover.y),
            { x: labelTextX, y: yAxisFn(hover.y) + fontSize / 2 },
            { font: `${fontSize}px`, fillStyle: 'white' }
        );
    }
    return null;
};
export default HelperLine;
