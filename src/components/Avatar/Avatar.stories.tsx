/* eslint-disable */
import { storiesOf } from '@storybook/react';
import Grid from 'storybook/Grid';
import styled from 'styled-components';
import Avatar from './index';

const TextButton = styled.button`
  background: none;
  outline: none;
  border: none;
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: #2669eb;
  text-align: center;
  width: 100%;
`

storiesOf('Form', module).add('Avatar', () => {
    const variants = [
        {
            name: "With image provided:",
            content: <Avatar size={50} url="https://i.imgur.com/Pw5gpf7.jpg" />,
        },
        {
            name: "Default placeholder:",
            content: <Avatar size={50} />,
        },
        {
            name: "JazzIcons address:",
            content: <Avatar size={50} address="0xe9e7cea3dedca5984780bafc599bd69add087d56" />,
        },
        {
            name: "With uploader:",
            content: <Avatar showUploader size={80} />,
        },
        {
            name: "With text:",
            content: (
                <Avatar showUploader size={80}>
                    <TextButton>Upload</TextButton>
                </Avatar>
            ),
        },
    ]

    return <Grid items={variants} />
});
