/* eslint-disable */
import { storiesOf } from '@storybook/react';
import Grid from 'storybook/Grid';
import { Flex } from 'theme';
import Button, { SecondaryButton } from './index';

storiesOf('Form', module).add('Button', () => {
    const variants = [
        {
            name: 'Disabled',
            content: (
            <SecondaryButton
                theme="disabled"
                size="large"
                fz={22}
                full
            >
                Enter amount to swap
            </SecondaryButton>
            )
        },
        {
            name: 'Primary',
            content: (
            <Button
                size="large"
                theme="primary"
                fz={22}
                full
            >
                Buy WBNB
            </Button>
            )
        },
        {
            name: 'Warn',
            content: (
            <Button
                size="large"
                theme="warn"
                fz={22}
                full
            >
                Sell ETH
            </Button>
            )
        },
        {
            name: 'Size normal:',
            content: (
            <Button
                size="normal"
                theme="warn"
                fz={22}
                full
            >
                Sell ETH
            </Button>
            )
        },
        {
            name: 'Size small:',
            content: (
            <Button
                size="small"
                theme="warn"
                fz={22}
                full
            >
                Sell ETH
            </Button>
            )
        },
    ]

    return <Grid items={variants} />
});
