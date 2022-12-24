import styled from "styled-components/macro"
import { motion } from "framer-motion"

import theme, { Flex } from "theme"
import { Icon } from "common"

export const StepsRoot = styled.div`
  display: flex;
  flex-direction: column;
  transform: scale(1);
  gap: 16px;
  padding: 14px 16px 20px;
`

export const Address = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.textColors.primary};
`

export const CardFooter = styled(Flex)`
  width: fill-available;
  justify-content: space-around;
`

export const NodeRightContainer = styled(motion.div)`
  padding: 5px;
  cursor: pointer;
`

export const NodeRightIcon = styled(Icon)`
  color: ${theme.textColors.secondary};
`

export const SelectItem = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  color: ${theme.textColors.primary};
  padding: 4px 0;
`

export const FieldNodeRight = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-align: right;
  color: #788ab4;
`
