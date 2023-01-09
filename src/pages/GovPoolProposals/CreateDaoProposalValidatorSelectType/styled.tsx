import styled from "styled-components/macro"

import { AppButton } from "common"

export { PageHolder, PageContent, SkeletonLoader } from "../styled"

export const HeaderWrp = styled.div`
  margin-bottom: 16px;
`

export const SubmitButton = styled(AppButton)`
  width: 100%;
  flex-shrink: 0;
`
