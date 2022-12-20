/* eslint-disable */
import { storiesOf } from '@storybook/react';
import Grid from 'storybook/Grid';
import styled from 'styled-components';
import { CircleSpinner } from "react-spinners-kit"
import theme, { Flex } from 'theme';
import { AppButton } from 'common';
import { ICON_NAMES } from 'constants/icon-names';
import { TabAmount } from 'components/Header/styled';

const Container = styled.div`
    position: relative;
    width: fill-available;
    height: 1348px;
    padding: 32px;

    background: #000000;
    border-radius: 40px;
`

const Title = styled.div`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 700;
    font-size: 144px;
    line-height: 174px;
    color: #7FFFD4;
    flex: none;
    order: 0;
    flex-grow: 0;
`

const List = styled(Flex)`
    align-items: flex-start;
    width: 350px;
    gap: 16px;
    flex-direction: column;
`

const Button = styled(AppButton).attrs(() => ({
    full: true,
}))`
    width: fill-available;
`

const TextButton = styled(AppButton)`
    width: fit-content;
`

const IconButton = styled(Button)`
    & > svg {
        transform: translate(-6px, -1px);
    }
`

storiesOf('Form', module).add('Button', () => {
    const variants = [
        {
            name: 'Buttons large',
            content: (
                <List>
                    <Button
                        size="large"
                        text="Buy TRX"
                    />
                    <Button
                        disabled
                        size="large"
                        text="Insufficient DEXE balance"
                    />
                    <Button
                        disabled
                        size="large"
                        text="Loading"
                        iconRight={<CircleSpinner color="#0D1320" size={10} />}
                    />
                    <Button
                        color="secondary"
                        type="button"
                        size="large"
                        text="Select token"
                        style={{ fontWeight: 600 }}
                    />
                    <IconButton
                        color="secondary"
                        type="button"
                        size="large"
                        text="Unlock token DEXE"
                        style={{ fontWeight: 600 }}
                        iconRight={ICON_NAMES.locked}
                        iconSize={17}
                    />
                    <Button
                        color="error"
                        type="button"
                        size="large"
                        text="Sell TRX"
                    />
                    <IconButton
                        color="secondary"
                        type="button"
                        size="large"
                        text="Add DEXE to wallet"
                        style={{ fontWeight: 600 }}
                        iconRight={ICON_NAMES.metamask}
                        iconSize={17}
                    />
                </List>
            )
        },
        {
            name: 'Buttons M',
            content: (
                <List style={{ width: 310 }}>
                    <Button
                        size="medium"
                        text="Confirm"
                    />
                    <Button
                        disabled
                        size="medium"
                        text="Confirm"
                    />
                    <Button
                        disabled
                        size="medium"
                        text="Loading"
                        iconRight={<CircleSpinner color="#0D1320" size={8} />}
                    />
                    <Button
                        color="secondary"
                        type="button"
                        size="medium"
                        text="Cancel"
                        style={{ fontWeight: 600 }}
                    />
                    <Button
                        color="error"
                        type="button"
                        size="medium"
                        text="Try again"
                    />
                </List>
            )
        },
        {
            name: 'Buttons S',
            content: (
                <List style={{ width: 147 }}>
                    <Button
                        size="small"
                        text="Buy DEXE"
                    />
                    <Button
                        color="secondary"
                        type="button"
                        size="small"
                        text="+ New proposal"
                        style={{ fontWeight: 600, color: theme.textColors.primary }}
                    />
                    <Button
                        disabled
                        color="secondary"
                        type="button"
                        size="small"
                        text="+ New proposal"
                        style={{ fontWeight: 600, color: theme.textColors.primary }}
                    />
                    <IconButton
                        size="small"
                        text="My investment"
                        iconRight={<TabAmount>2</TabAmount>}
                    />
                </List>
            )
        },
        {
            name: 'Buttons XS',
            content: (
                <List style={{ width: 96 }}>
                    <Button
                        size="x-small"
                        text="Stake LP"
                    />
                </List>
            )
        },
        {
            name: 'Buttons TEXT',
            content: (
                <List style={{ width: 96 }}>
                    <TextButton
                        text="Details"
                        type="button"
                        color="default"
                        size="no-paddings"
                        style={{ fontSize: 13 }}
                    />
                    <TextButton
                        text="Claim"
                        type="button"
                        color="default"
                        size="no-paddings"
                        style={{ fontSize: 13 }}
                        iconRight={<TabAmount>2</TabAmount>}
                    />
                    <TextButton
                        disabled
                        text="Details"
                        type="button"
                        color="default"
                        size="no-paddings"
                        style={{ fontSize: 13 }}
                    />
                </List>
            )
        },
    ]

    return (
        <Container>
            <Title>Buttons</Title>
            <Grid items={variants} />
        </Container>
    )
});
