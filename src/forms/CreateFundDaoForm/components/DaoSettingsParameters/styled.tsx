import styled from "styled-components/macro"

import { Icon, CardFormControl } from "common/index"
import theme, { respondTo } from "theme"

export const SuccessLabelIcon = styled(Icon)`
  color: ${theme.statusColors.success};
`

export const DurationCardFormControl = styled(CardFormControl)`
  padding: 0;
  padding-top: 16px;
`

export const DurationParamsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex-wrap: wrap;

  ${respondTo("sm")} {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
`

export const PercentLabel = styled.span`
  color: ${theme.textColors.primary};
`

export const RewardsContainer = styled(CardFormControl)`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap-reverse;
  gap: 24px;
`

export const Rewards = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  gap: 24px;
  width: 60%;
`

export const RewardsImg = styled.img`
  flex: 0 1 30%;
  max-width: 250px;
`
