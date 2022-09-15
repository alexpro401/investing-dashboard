/* eslint-disable */
import { storiesOf } from '@storybook/react';
import Grid from 'storybook/Grid';
import TextArea from './index';

storiesOf('Form', module).add('TextArea', () => {
    const variants = [
        {
            name: "Default",
            content: <TextArea name="area" onChange={() => {}} defaultValue="" />
        },
        {
            name: "Placeholder",
            content: <TextArea name="area" placeholder="Enter your description" onChange={() => {}} defaultValue="" />
        },
        {
            name: "With default value",
            content: <TextArea name="area" placeholder="Enter your description" onChange={() => {}} defaultValue="Lorem ipsum" />
        },
    ]

    return <Grid items={variants} />
});
