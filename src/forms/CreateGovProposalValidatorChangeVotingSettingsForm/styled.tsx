import styled from "styled-components/macro"

import theme from "theme"
import { AppButton, Icon } from "common"

export const DesktopHeaderWrp = styled.div`
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
`

export const VotingSettingsModalButton = styled(AppButton)`
  font-size: 13px;
`

export const SuccessLabelIcon = styled(Icon)`
  color: ${theme.statusColors.success};
`
