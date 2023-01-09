import styled from "styled-components/macro"
import { Flex } from "theme"
import { motion } from "framer-motion"

export const Container = styled(Flex)`
  width: 100%;
  flex-direction: column;
  align-items: center;
  height: fit-content;
  border-radius: 16px;
  position: relative;

  background: #181e2c;
  border: 1px solid #293c54;
`

export const Card = styled(Flex)`
  width: 100%;
  padding: 17px 20px 17px 14px;
`

export const Content = styled(Flex)`
  width: 100%;
  flex-direction: column;
  padding: 0 0 16px;
`

export const WhiteText = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 100%;
  letter-spacing: 0.3px;

  color: #e4f2ff;
`

export const TokenPrice = styled(WhiteText)`
  padding-right: 4px;
`

export const UsdPrice = styled(WhiteText)`
  color: #b1c7fc;
  font-style: italic;
`

export const GasPrice = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 11px;
  letter-spacing: 0.3px;
  transform: translateY(1px);

  color: #b1c7fc;
`

export const GasIcon = styled.img`
  width: 12.67px;
  height: 12px;
`

export const AngleIcon = styled(motion.img)`
  transform: translateY(1px);
`

export const SwapPathContainer = styled(Flex)`
  width: 100%;
  padding: 12px 0;
  height: 47px;
  justify-content: space-between;
  position: relative;

  & > img {
    z-index: 2;
  }

  &:after {
    position: absolute;
    right: 5px;
    left: 5px;
    z-index: 1;
    height: 1px;
    border-bottom: 1px dashed #1f2b3d;
    content: "";
    flex: 1;
  }
`

export const TokensUnion = styled(Flex)`
  width: 34px;
  height: 23px;

  & > img {
    z-index: 2;

    &:first-child {
      transform: translateX(2px);
    }
    &:last-child {
      transform: translateX(-2px);
    }
  }

  border-radius: 32px;
  border: 1px solid #2f4460;
`
