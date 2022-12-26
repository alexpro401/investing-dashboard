/* eslint-disable */
import { storiesOf } from '@storybook/react';
import Grid from 'storybook/Grid';
import styled from 'styled-components';
import { Flex } from 'theme';
import { Headline1, Headline2, Headline3 } from 'common/Typography';
import { RegularText, MediumText, ButtonText, ThinText, DescriptionText } from 'common/Typography';

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

storiesOf('common', module).add('Typography', () => {
    const variants = [
        {
            name: 'Headlines',
            content: (
                <List>
                    <Headline1>Headline 1</Headline1>
                    <Headline2>Headline 2</Headline2>
                    <Headline3>Headline 3</Headline3>
                </List>
            )
        },
        {
            name: 'Text',
            content: (
                <List>
                    <RegularText>Regular text</RegularText>
                    <MediumText>Medium text</MediumText>
                    <ThinText>Small text</ThinText>
                    <ButtonText>Button text</ButtonText>
                </List>
            )
        },
        {
            name: 'Text',
            content: (
                <List>
                    <DescriptionText>Description - Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae </DescriptionText>
                </List>
            )
        }
    ]

    return (
        <Container>
            <Title>Typography</Title>
            <Grid items={variants} />
        </Container>
    )
});
