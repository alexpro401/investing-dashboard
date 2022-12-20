import styled from "styled-components"
import { Flex } from "theme"

const Styled = {
  Container: styled.div``,

  Content: styled(Flex)``,

  List: styled.div`
    padding: 16px;
    position: relative;
    overflow-y: auto;
  `,

  ListLoading: styled(Flex)``,
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
