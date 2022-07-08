import React, { useContext, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import { ChartContext } from './context';

interface Props {
    render: (data: any) => void;
}
const Tooltip: React.FC<Props> = (props) => {
    const { render } = props;
    const { hoverItem } = useContext(ChartContext);
    const element = useRef(document.createElement('div'));
    useEffect(() => {
        document.body.append(element.current);
        return () => {
            element.current;
        };
    }, []);
    return ReactDOM.createPortal(
        <div
            className="tooltip"
            style={{
                top: hoverItem ? hoverItem.y + 24 : undefined,
                left: hoverItem ? hoverItem.x : undefined,
                display: !hoverItem ? 'none' : undefined,
            }}
        >
            {hoverItem?.data && render(hoverItem.data)}
        </div>,
        element.current
    );
};
export default Tooltip;
