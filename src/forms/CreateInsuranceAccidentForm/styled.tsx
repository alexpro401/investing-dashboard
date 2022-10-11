import styled from "styled-components"
import { Flex } from "theme"
import StepsControllerContext from "context/StepsControllerContext"
import { StepsNavigation } from "common"

export const Container = styled(StepsControllerContext)``

export const StepsRoot = styled(Flex)`
  width: 100%;
  height: calc(100vh - 146px);
  overflow-y: auto;

  @media all and (display-mode: standalone) {
    height: calc(100% - 165px);
  }
`

export const StepsBottomNavigation = styled(StepsNavigation)`
  margin-top: auto;
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
    font-family: "Gilroy";
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
    background: #181e2c;
    border: 1px solid ${(p) => (p.active ? "#9AE2CB" : "#181e2c")};
    cursor: pointer;

    &:not(:last-child) {
      margin-bottom: 16px;
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
