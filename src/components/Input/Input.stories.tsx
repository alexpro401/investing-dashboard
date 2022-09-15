/* eslint-disable */
import { storiesOf } from '@storybook/react';
import { useState } from 'react';
import styled from 'styled-components';
import ExpandIcon from "assets/icons/Expand"
import Input from './index';
import Grid from 'storybook/Grid';

const Text = styled.div`
  padding: 0 5px;
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  color: #b1c7fc;
`

const Label = styled.div`
  margin-bottom: 30px;
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 150%;
  color: #b1c7fc;
`

storiesOf('Input', module)
    .add('default', () => {
        const [value, setValue] = useState('Type something here');

        const variants = [
            {
                name: "With placeholder:",
                content: <Input value="" placeholder="Paste your address" />
            },
            {
                name: "With value:",
                content: <Input value="0.8291 DAI" />
            },
            {
                name: "With label:",
                content: <Input value="0.9392" label="My label here" />
            },
            {
                name: "Interactive:",
                content: <Input onChange={(v) => setValue(v)} value={value} label="My label here" />
            },
            {
                name: "Disabled:",
                content: <Input disabled value="" placeholder="Paste your address" />
            },
            {
                name: "With grey theme:",
                content: <Input value="0.8291 DAI" theme="grey" />
            },
            {
                name: "With error border:",
                content: <Input error value="0.9392" label="My label here" />
            },
            {
                name: "Right icon:",
                content: <Input rightIcon={<ExpandIcon />} value="0.9392" placeholder="text here" />
            },
            {
                name: "Left icon:",
                content: <Input leftIcon={<ExpandIcon />} value="0.9392" placeholder="text here" />
            },
            {
                name: "Right text element:",
                content: <Input rightIcon={<Text>text</Text>} value="0.9392" placeholder="text here" />
            },
            {
                name: "Left icon:",
                content: <Input leftIcon={<Text>text</Text>} value="0.9392" placeholder="text here" />
            },
        ];

        return <Grid items={variants} />
    });
