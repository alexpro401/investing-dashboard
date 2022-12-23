import styled from "styled-components"

import theme from "theme"
import { AppButton, Icon } from "common"

export const StepsRoot = styled.div`
  display: flex;
  flex-direction: column;
  transform: scale(1);
  gap: 16px;
  padding: 14px 16px 20px;
`
export const VotingSettingsModalButton = styled(AppButton)`
  font-size: 13px;
`

export const SuccessLabelIcon = styled(Icon)`
  color: ${theme.statusColors.success};
`
