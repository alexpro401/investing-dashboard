import styled from "styled-components/macro"

import { AppButton, SideStepsNavigationBar } from "common"

export const DesktopHeaderWrp = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
`

export const SideStepsNavigationBarWrp = styled(SideStepsNavigationBar)`
  width: 100%;
  height: 100%;
`

export const VotingSettingsModalButton = styled(AppButton)`
  font-size: 13px;
`
