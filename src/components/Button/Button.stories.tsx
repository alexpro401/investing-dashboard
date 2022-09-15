/* eslint-disable */
import { storiesOf } from '@storybook/react';
import MemoLockedIcon from 'assets/icons/LockedIcon';
import Grid from 'storybook/Grid';
import { Flex } from 'theme';
import Button, { SecondaryButton } from './index';

storiesOf('Button', module).add('default', () => {
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
            name: "With icon",
            content: (
            <SecondaryButton
                size="large"
                fz={22}
                full
              >
                <Flex>
                  <Flex ai="center">Unlock Token</Flex>
                  <Flex m="-3px 0 0 4px">
                    <MemoLockedIcon />
                  </Flex>
                </Flex>
              </SecondaryButton>
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
