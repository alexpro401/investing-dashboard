import styled from "styled-components/macro"

export { PageHolder, PageContent, SkeletonLoader } from "../styled"

import Skeleton from "components/Skeleton"

export const DesktopHeaderWrp = styled.div`
  margin-bottom: 8px;
`

export const SkeletonCard = styled(Skeleton)`
  border-radius: 20px;
`
