import styled from "styled-components/macro"
import { Icon } from "common"
import { motion } from "framer-motion"

export const ToggleSearchIcon = styled(Icon)`
  font: inherit;
  color: inherit;
`

export const ToggleSearchButton = styled(motion.button)`
  display: grid;
  place-items: center;
  border: none;
  outline: none;
  background: none;
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translate(-50%, -50%);
  color: #6781bd;
  -webkit-text-fill-color: #6781bd;
  padding: 4px;
  z-index: 5;

  &:focus {
    outline: none;
    border: none;
  }
`

export const ToggleSearchInputWrp = styled(motion.div)`
  position: relative;
  overflow: hidden;
  background: #141926;
  border-radius: 16px;
  display: flex;
  min-width: 40px;
`

export const ToggleSearchInput = styled(motion.input)`
  border: none;
  padding: 9px 18px 9px 40px;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: #6781bd;
  -webkit-text-fill-color: #6781bd;
  width: 100%;

  &:focus {
    border: none;
    outline: none;
  }

  &:not(:read-only),
  &:-webkit-autofill,
  &:-webkit-autofill:focus {
    box-shadow: inset 0 0 0 50px #141926;
    background: #141926;
  }
`
