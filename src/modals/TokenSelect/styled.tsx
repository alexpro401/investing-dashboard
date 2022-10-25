import styled from "styled-components"
import { Flex } from "theme"
import { motion } from "framer-motion"
import { AppButton } from "common"

export const Container = styled(motion.div)`
  border-radius: 10px;
  position: absolute;
  background: linear-gradient(64.44deg, #191e2b 32.35%, #272e3e 100%);
  border-radius: 10px;
  top: 210px;
  left: 16px;
  right: 16px;
  z-index: 100;
`

export const Overlay = styled(motion.div)`
  background: rgba(27, 27, 27, 0.6);
  backdrop-filter: blur(6px);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 80;
  height: 100%;
  width: 100%;
`

export const Head = styled(Flex)`
  width: 100%;
  justify-content: space-between;
`

export const Title = styled.div`
  font-family: Gilroy;
  font-style: normal;
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  letter-spacing: 0.35px;
  color: #c5d1dc;
`

export const Close = styled.img``

export const Placeholder = styled(Flex)`
  justify-content: center;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  min-width: 0px;
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: #b1c7fc;
  text-align: center;
`

// TOKENS CARD

export const Card = styled(Flex)`
  width: 100%;
  flex-direction: column;
`

export const CardHeader = styled(Flex)`
  flex-direction: column;
  width: fill-available;
  padding: 0 16px 16px;
  justify-content: flex-start;

  &:empty {
    padding: 0 16px;
  }
`

export const CardList = styled.div`
  position: relative;
  width: 100%;
  height: fit-content;
  max-height: 448px;
  overflow-y: auto;
  padding-top: 16px;

  &:before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    margin: auto;
    width: 100%;
    content: "";
    height: 1px;
    background: radial-gradient(
          54.8% 53% at 50% 50%,
          #587eb7 0%,
          rgba(88, 126, 183, 0) 100%
        )
        /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
      radial-gradient(
          60% 51.57% at 50% 50%,
          #6d99db 0%,
          rgba(109, 153, 219, 0) 100%
        )
        /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
      radial-gradient(
          69.43% 69.43% at 50% 50%,
          rgba(5, 5, 5, 0.5) 0%,
          rgba(82, 82, 82, 0) 100%
        )
        /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
    opacity: 0.1;
  }
`

export const Footer = styled(Flex)`
  box-sizing: border-box;
  width: 100%;
  padding: 16px;
  position: relative;
  &:before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    margin: auto;
    width: 100%;
    content: "";
    height: 1px;
    background: radial-gradient(
          54.8% 53% at 50% 50%,
          #587eb7 0%,
          rgba(88, 126, 183, 0) 100%
        )
        /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
      radial-gradient(
          60% 51.57% at 50% 50%,
          #6d99db 0%,
          rgba(109, 153, 219, 0) 100%
        )
        /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
      radial-gradient(
          69.43% 69.43% at 50% 50%,
          rgba(5, 5, 5, 0.5) 0%,
          rgba(82, 82, 82, 0) 100%
        )
        /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
    opacity: 0.1;
  }
`

export const ImportButton = styled(AppButton)`
  flex: 1 0 auto;
`
