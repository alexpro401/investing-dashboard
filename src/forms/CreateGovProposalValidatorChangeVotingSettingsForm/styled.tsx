import styled from "styled-components/macro"

import theme from "theme"
import { AppButton, Icon } from "common"

export const VotingSettingsModalButton = styled(AppButton)`
  font-size: 13px;
`

export const SuccessLabelIcon = styled(Icon)`
  color: ${theme.statusColors.success};
`
