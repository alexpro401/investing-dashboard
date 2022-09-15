/* eslint-disable */
import { storiesOf } from '@storybook/react';
import { useState } from 'react';
import Grid from 'storybook/Grid';
import Switch from './index';

storiesOf('Switch', module).add('default', () => {
    const [isOn, setIsOn] = useState(false)

    const variants = [
        {
            name: "Switched Off:",
            content: <Switch isOn={false} onChange={() => {}} name="switch" />
        },
        {
            name: "Switched On:",
            content: <Switch isOn onChange={() => {}} name="switch" />
        },
        {
            name: "Dissabled:",
            content: <Switch isOn disabled onChange={() => {}} name="switch" />
        },
    ]

    return <Grid items={variants} />
});
