import { NavLink } from "react-router-dom"
import styled from "styled-components"
import { motion } from "framer-motion"

import theme from "theme"
import { AppButton } from "common"

export const CreateProposalSelectTypePageHolder = styled(motion.div)`
  width: 100%;
  padding: 16px;
  height: calc(100vh - 94px);
  overflow-y: auto;
`

export const CreateProposalSelectTypeContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`

export const CreateProposalSelectTypeHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
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
  width: 100%;
`
export const ProposalTypeGuide = styled.div`
  overflow: visible;
  display: grid;
  grid-gap: 8px;
`

export const ProposalTypeGuideItem = styled.div`
  position: relative;
  font-size: 13px;
  line-height: 1.5;
  font-weight: 500;
  color: ${(props) => props.theme.textColors.secondary};
`
