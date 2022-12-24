import styled from "styled-components/macro"
import { Flex, GradientBorder } from "theme"

const Styled = {
  Title: styled.div`
    width: 100%;
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    color: #e4f2ff;
  `,
  Container: styled(GradientBorder)`
    width: 100%;
    height: 241px;
    margin-top: 16px;
    border-radius: 15px;
    flex-direction: column;

    &:after {
      background: #0f1421;
    }
  `,
  List: styled.div`
    width: 100%;
    padding: 0 16px 16px;
    height: 200px;
    overflow-y: auto;
  `,

  ListHeader: styled.div`
    display: grid;
    grid-template-columns: 33% 35.7% 1fr;
    width: 100%;
    margin-bottom: 2px;
    padding: 16px 16px 0;
  `,
  ListHeaderItem: styled(Flex)`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 15px;
    color: #788ab4;

    &:nth-child(2) {
      text-align: center;
    }
  `,
  Content: styled(Flex)`
    width: 100%;
    padding: 16px;
    height: inherit;
    align-items: center;
    justify-content: center;
  `,
  WithoutData: styled.div`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 16px;
    color: #e4f2ff;
  `,
}

export default Styled
