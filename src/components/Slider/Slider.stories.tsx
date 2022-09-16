/* eslint-disable */
import { storiesOf } from '@storybook/react';
import Slider from './index';

storiesOf('Form', module).add('Slider', () => {
    return (
        <div style={{ width: "450px" }}>
            <Slider name="slider" onChange={() => {}} limits={{ min: 0, max: 100 }} initial={30} />
        </div>
    )
});
