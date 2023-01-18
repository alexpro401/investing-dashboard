import styled from "styled-components/macro"

import { AppButton } from "common"
import theme, { respondTo } from "theme"

export const DesktopHeaderWrp = styled.div`
  margin-bottom: 16px;
`

export const TokenContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const TokenContainerLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`

export const TokenContainerRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
`

export const TokenImg = styled.img`
  width: 35px;
  height: 35px;
`

export const TokenNamings = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
`

export const TokenTitle = styled.div`
  display: flex;
  gap: 5px;
`

export const TokenTitleInner = styled.span`
  color: ${theme.textColors.primary};
  font-size: 13px;
  text-transform: uppercase;
  font-weight: 600;
`

export const TokenName = styled.span`
  font-size: 13px;
  font-weight: 500px;
  color: ${theme.textColors.secondary};
`

export const TokenUsdAmount = styled.span`
  color: ${theme.textColors.primary};
  font-size: 13px;
  font-weight: 600;
`

export const BaseInputPlaceholder = styled.span`
  color: #788ab4;
`

export const AddPairButton = styled(AppButton).attrs(() => ({
  color: "default",
  size: "no-paddings",
}))`
  margin: 0 auto;
  margin-top: 20px;
`

export const BaseTokenSettingsGrid = styled.div`
  display: grid;
  gap: 24px;

  ${respondTo("md")} {
    grid-template-columns: repeat(2, 1fr);
  }
`
