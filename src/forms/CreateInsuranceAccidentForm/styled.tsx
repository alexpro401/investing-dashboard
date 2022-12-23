import styled from "styled-components/macro"
import { Flex, respondTo } from "theme"
import { motion } from "framer-motion"
import { opacityVariants } from "motion/variants"
import StepsControllerContext from "context/StepsControllerContext"

export const Container = styled(StepsControllerContext)`
  display: flex;
  margin: 0 auto;
  width: 100%;
  flex: 1;
`

export const StepsWrapper = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
`

export const StepsContainer = styled(motion.div).attrs(() => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
  variants: opacityVariants,
}))`
  overflow: hidden auto;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 775px;
  margin: 0 auto;
  align-self: center;

  ${respondTo("lg")} {
    padding-bottom: 40px;
  }
`

export const StepsRoot = styled.div`
  display: flex;
  flex-direction: column;
  transform: scale(1);
  gap: 16px;
  padding: 14px 16px 20px;
  flex: 1;

  ${respondTo("lg")} {
    padding: 20px 0;
  }
`

export const StepNumber = {
  Icon: styled.div`
    position: relative;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1.5px solid #7fffd4;
  `,
  Text: styled.span`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #7fffd4;
    font-size: 12px;
    line-height: 1.2;
    font-weight: 700;
    text-align: center;
    text-transform: uppercase;
  `,
}

export const CreateInsuranceAccidentPoolsStyled = {
  Container: styled.div``,
  Title: styled.div`
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    color: #e4f2ff;
  `,

  SortButton: styled.button`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: transparent;
    border: none;
    gap: 7px;
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    color: #9ae2cb;
    cursor: pointer;
  `,
  SortButtonIconsWrp: styled(Flex)`
    color: #20283a;
  `,

  Card: styled.div<{ active: boolean }>`
    width: 100%;
    border-radius: 12px;
    background: ${({ theme }) => theme.backgroundColors.secondary};
    border: 1px solid
      ${(p) =>
        p.active
          ? p.theme.statusColors.success
          : p.theme.backgroundColors.secondary};
    cursor: pointer;

    &:not(:last-child) {
      margin-bottom: 16px;
    }

    ${respondTo("lg")} {
      background: transparent;
      border-radius: 60px 24px 24px 60px;
      border: 1px solid
        ${(p) => (p.active ? p.theme.statusColors.success : "transparent")};
    }
  `,
  CardContent: styled(Flex)`
    width: 100%;
    padding: 12px;
  `,
  CardIcons: styled.div`
    width: 45px;
    position: relative;
  `,
  CardTokenIconWrp: styled.div`
    position: absolute;
    bottom: 0;
    right: -8px;
  `,
}

export const InputGroup = styled.div`
  width: 100%;
  display: flex;
  border: 1px solid #293c54;
  backdrop-filter: blur(21px);
  border-radius: 16px;

  & > *:nth-child(1) {
    width: 45%;
  }

  & > *:nth-child(2) {
    width: 55%;
  }
`
