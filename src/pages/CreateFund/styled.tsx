import styled from "styled-components/macro"
import { motion } from "framer-motion"
import { Icon } from "common"

export const PageHolder = styled(motion.div).attrs(() => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}))`
  width: 100%;
  overflow-y: auto;
`

export const PageContent = styled.div`
  overflow: hidden auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
`

export const DesktopHeaderWrp = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`

export const FundTypeCards = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 16px;
  width: 100%;
`

export const FundTypeCardsTitle = styled.h3`
  font-size: 16px;
  line-height: 1.2;
  color: #e4f2ff;
  font-weight: 700;
`

export const CreateFundDaoFeatures = styled.div`
  overflow: visible;
  display: grid;
  grid-gap: 8px;
  transform: translateX(-20px);
`

export const CreateFundDaoFeaturesItem = styled.div`
  display: grid;
  grid-template-columns: 12px 1fr;
  grid-gap: 8px;
  position: relative;
  font-size: 13px;
  line-height: 1.5;
  font-weight: 500;
  color: ${(props) => props.theme.textColors.secondary};
`

export const CreateFundDaoFeaturesItemIcon = styled(Icon)`
  width: 16px;
  height: 16px;
  color: ${(props) => props.theme.statusColors.success};
`
