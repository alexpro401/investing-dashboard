import * as React from "react"
import styled from "styled-components/macro"

type ArrowDirection =
  | "top"
  | "top-right"
  | "right"
  | "bottom-right"
  | "bottom"
  | "bottom-left"
  | "left"
  | "top-left"

interface Props {
  active: boolean
  color?: string
  dir?: ArrowDirection
}

function getRotation(direction) {
  switch (direction) {
    case "top":
      return "-45deg"
    case "top-right":
      return "0deg"
    case "right":
      return "45deg"
    case "bottom-right":
      return "90deg"
    case "bottom":
      return "135deg"
    case "bottom-left":
      return "180deg"
    case "left":
      return "225deg"
    case "top-left":
      return "270deg"
    default:
      return "0deg"
  }
}

const Svg = styled.svg<{ direction: ArrowDirection }>`
  transform: rotate(${({ direction }) => getRotation(direction)});
`

const ArrowIcon: React.FC<Props> = ({ color, dir = "right" }) => {
  return (
    <Svg width="16" height="17" viewBox="0 0 16 17" fill="none" direction={dir}>
      <path
        d="M5.33366 11.167L10.667 5.83366"
        stroke={color ?? "currentColor"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66699 5.83301L10.667 5.83301V9.83301"
        stroke={color ?? "currentColor"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

const MemoArrowIcon = React.memo(ArrowIcon)
export default MemoArrowIcon
