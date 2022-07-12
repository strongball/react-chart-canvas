import { render } from '@testing-library/react';
import BaseChart from '../BaseChart';
import XAxis from '../XAxis';
import { MockRender } from '../__mocks__/MockRender';

describe('BaseChart', () => {
    it('Can render', () => {
        const wrapper = render(
            <BaseChart height={300} width={500} xAxisTicks={[1, 2, 3]} yAxisTicks={[1, 2, 4]}>
                <XAxis />
            </BaseChart>
        );
    });
    it('Base render', () => {
        const mockRender = new MockRender();
        const wrapper = render(
            <BaseChart height={300} width={500} xAxisTicks={[1, 2, 3]} yAxisTicks={[1, 2, 4]} mockRender={mockRender}>
                <XAxis />
            </BaseChart>
        );
        expect(mockRender.getSymbolsByType('text').length).toBe(3);
        expect(mockRender.getSymbolsByType('line').length).toBe(3);
    });
    it('Without line', () => {
        const mockRender = new MockRender();
        const wrapper = render(
            <BaseChart height={300} width={500} xAxisTicks={[1, 2, 3]} yAxisTicks={[1, 2, 4]} mockRender={mockRender}>
                <XAxis line={false} />
            </BaseChart>
        );
        expect(mockRender.getSymbolsByType('text').length).toBe(3);
        expect(mockRender.getSymbolsByType('line').length).toBe(0);
    });
});
