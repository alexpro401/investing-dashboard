import styled from "styled-components/macro"

import theme, { respondTo } from "theme"
import { AppButton } from "common"

export const ValidatorsSection = styled.div`
  background-color: ${theme.backgroundColors.secondary};
  border-radius: 20px;
  width: 100%;
  padding: 16px;

  ${respondTo("sm")} {
    padding: 24px;
  }
`

export const ValidatorsSectionHeader = styled.div`
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  ${respondTo("sm")} {
    margin-bottom: 24px;
  }
`

export const HeaderButton = styled(AppButton)`
  font-size: 13px;
  line-height: 16px;

  ${respondTo("sm")} {
    font-size: 16px;
    line-height: 19px;
  }
`

export const ValidatorsList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
