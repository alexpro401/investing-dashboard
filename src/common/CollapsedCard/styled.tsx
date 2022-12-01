import styled from "styled-components"
import { motion } from "framer-motion"

import { Icon, Card, Collapse } from "common"
import theme from "theme"

export const CollCard = styled(Card)<{ isOpen: boolean }>`
  ${(props) => (!props.isOpen ? "gap: 0" : "")}
`

export const CollCardTopbar = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`

export const CollCardHead = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.textColors.primary};
`

export const CollCardHeadButton = styled(motion.button)`
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  outline: none;
`

export const CollapseIcon = styled(Icon)`
  color: ${theme.textColors.secondary};
`

export const CollCardTitle = styled.span`
  font-size: 16px;
  line-height: 1.2;
  font-weight: 700;
  margin: 0;
  vertical-align: middle;
`

export const CustomCollapse = styled(Collapse)`
  gap: 12px;
  display: flex;
  flex-direction: column;
`
