import styled from "styled-components"
import { motion } from "framer-motion"

import { Flex, GradientBorderLightGreen } from "theme"

const Styled = {
  Container: styled.div`
    width: fill-available;
    flex: 1;
  `,
  Heading: styled(motion.div)`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 28px;
    margin-bottom: 24px;

    text-align: center;
    letter-spacing: 0.35px;
    width: 100%;
    color: #cfdce8;
  `,
  Content: styled(motion.div)`
    position: absolute;
    left: 0;
    right: 0;
    z-index: 90;
  `,
  Header: styled(Flex)`
    width: 100%;
    justify-content: space-around;
  `,
  HeaderButton: styled(GradientBorderLightGreen)`
    border-radius: 16px;
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 12px;
    text-align: center;
    letter-spacing: 0.3px;
    color: ${(props) => (props.focused ? "#9AE2CB" : "#616d8b")};
    height: 25px;
    padding: 0 10px;

    &:after {
      background: #0d121c;
    }
  `,
  List: styled.div`
    width: 100%;
    overflow-y: auto;
    margin-top: 15px;
    padding: 0 16px;
  `,
  ListPlaceholder: styled.div`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 300;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0.1px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: inherit;
    flex: 1;
    color: #5a6071;
  `,
}
export default Styled
