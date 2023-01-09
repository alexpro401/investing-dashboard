import { NavLink } from "react-router-dom"
import styled from "styled-components/macro"
import { motion } from "framer-motion"

import theme from "theme"
import { AppButton } from "common"
import Tooltip from "components/Tooltip"

export { PageHolder, SkeletonLoader } from "../styled"

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--app-gap);
  height: 100%;
`

export const HeaderWrp = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`

export const DesktopHeaderWrp = styled.div`
  margin-bottom: 16px;
`

export const BlockTitle = styled.span`
  font-weight: 700;
  font-size: 16px;
  color: ${theme.textColors.primary};
`

export const BlockGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`

export const CreateProposalSelectTypeTitle = styled.span`
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: ${theme.textColors.primary};
`

export const CreateProposalSelectTypeCreateNew = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${theme.brandColors.secondary};
  font-weight: 600;
  text-decoration: none;
  font-size: 16px;
  line-height: 19px;
`
export const CreateProposalSelectTypeSubmitButton = styled(AppButton)`
  margin-top: auto;
  width: 100%;
  flex-shrink: 0;
`
export const ProposalTypeGuide = styled.div`
  overflow: visible;
  display: grid;
  grid-gap: 8px;
`

export const ProposalTypeTooltipWrp = styled.div`
  position: relative;
  z-index: 2;
`

export const ProposalTypeTooltip = styled(Tooltip)``

export const ProposalTypeGuideItem = styled.div`
  position: relative;
  font-size: 13px;
  line-height: 1.5;
  font-weight: 500;
  color: ${(props) => props.theme.textColors.secondary};
`
