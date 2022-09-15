/* eslint-disable */
import { storiesOf } from '@storybook/react';
import { useState } from 'react';
import styled from 'styled-components';
import ExpandIcon from "assets/icons/Expand"
import Input from './index';

const Page = styled.div`
    height: fill-available;
    overflow: auto;
    width: fill-available;
    max-width: 900px;
    padding: 50px 0;
    box-sizing: border-box;
    display: grid; 
    grid-template-columns: 1fr 1fr 1fr; 
    grid-template-rows: 1fr 1fr 1fr; 
    gap: 0px 32px; 
    grid-template-areas: 
    ". . ."
    ". . ."
    ". . .";
`

const Tile = styled.div`
    display: flex;
    flex-direction: column;
`

const Text = styled.div`
    padding: 0 5px;
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 150%;
    color: #B1C7FC;
`

const Label = styled.div`
    margin-bottom: 30px;
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 150%;
    color: #B1C7FC;
`

storiesOf('Input', module)
    .add('default', () => {
        const [value, setValue] = useState('Type something here');

        return (
            <Page>
                <Tile>
                    <Label>With placeholder:</Label>
                    <Input value="" placeholder="Paste your address" />
                </Tile>
                <Tile>
                    <Label>With value:</Label>
                    <Input value="0.8291 DAI" />
                </Tile>
                <Tile>
                    <Label>With label:</Label>
                    <Input value="0.9392" label="My label here" />
                </Tile>
                <Tile>
                    <Label>Interactive:</Label>
                    <Input onChange={(v) => setValue(v)} value={value} label="My label here" />
                </Tile>
                <Tile>
                    <Label>Disabled:</Label>
                    <Input disabled value="" placeholder="Paste your address" />
                </Tile>
                <Tile>
                    <Label>With grey theme:</Label>
                    <Input value="0.8291 DAI" theme="grey" />
                </Tile>
                <Tile>
                    <Label>With error border:</Label>
                    <Input error value="0.9392" label="My label here" />
                </Tile>
                <Tile>
                    <Label>Right icon:</Label>
                    <Input rightIcon={<ExpandIcon />} value="0.9392" placeholder="text here" />
                </Tile>
                <Tile>
                    <Label>Left icon:</Label>
                    <Input leftIcon={<ExpandIcon />} value="0.9392" placeholder="text here" />
                </Tile>
                <Tile>
                    <Label>Right text element:</Label>
                    <Input rightIcon={<Text>text</Text>} value="0.9392" placeholder="text here" />
                </Tile>
                <Tile>
                    <Label>Left icon:</Label>
                    <Input leftIcon={<Text>text</Text>} value="0.9392" placeholder="text here" />
                </Tile>
            </Page>
        )
    });
