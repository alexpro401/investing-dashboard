import styled from "styled-components/macro"
import { Flex } from "theme"

const Styled = {
  Container: styled.div`
    padding: 16px 16px 0;
    position: relative;
    overflow-y: auto;
  `,
  Content: styled(Flex)`
    width: 100%;
    justify-content: center;
    align-items: center;
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
