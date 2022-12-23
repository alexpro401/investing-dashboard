import styled from "styled-components/macro"
import { motion } from "framer-motion"

import { Icon } from "common"
import theme from "theme"

export const PersonProposalList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: stretch;
  gap: 16px;
  padding: 0 20px 20px 20px;
`

export const PersonProposal = styled(motion.div)`
  border-radius: 20px;
  padding: 16px;
  width: calc(100% - 32px);
  background-color: ${theme.textColors.secondaryNegative};
  border: 1px solid transparent;
  transition: border 0.2s ease;

  &:hover {
    border: 1px solid ${theme.statusColors.success};
    cursor: pointer;
  }
`

export const ProposalTopbar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`

export const ProposalTitle = styled.span`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: ${theme.textColors.primary};
`

export const ProposalText = styled.span`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 150%;
  color: ${theme.textColors.secondary};
`

export const ProposalIcon = styled(Icon)`
  color: ${theme.textColors.secondary};
`
