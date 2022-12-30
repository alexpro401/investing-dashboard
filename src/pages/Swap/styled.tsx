import { AppButton } from "common"
import { ICON_NAMES } from "consts/icon-names"
import styled from "styled-components/macro"
import { Flex } from "theme"

export const SwapPriceBody = styled(Flex)`
  flex-direction: column;
  width: 100%;
  padding: 12px 16px;
  border-top: 1px solid #1d2635;
  border-bottom: 1px solid #1d2635;
  gap: 12px;
`

export const SwapRouteBody = styled(Flex)`
  flex-direction: column;
  width: 100%;
  padding: 12px 16px 0;
`

export const SwapPathIcon = styled.img`
  width: 13px;
  height: 13px;
  transform: translateY(-1px);
`

export const SwapPathTitle = styled(Flex)`
  gap: 6px;
  justify-content: flex-start;
  width: 100%;
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  color: #e4f2ff;
`

export const SwapPathDescription = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 130%;
  color: #788ab4;
`

export const CreateProposal = styled(AppButton).attrs(() => ({
  text: "Create proposal",
  type: "button",
  color: "default",
  size: "no-paddings",
  iconLeft: ICON_NAMES.plus,
  iconSize: 26,
}))`
  padding: 16px 0 0;

  & > svg {
    transform: translate(2px, -2px);
  }
`
