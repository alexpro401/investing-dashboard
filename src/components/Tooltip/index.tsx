import { ReactNode, useState } from "react"
import ReactTooltip from "react-tooltip"
import ReactDOMServer from "react-dom/server"

import TooltipIcon from "assets/icons/TooltipIcon"
import styled, { createGlobalStyle } from "styled-components/macro"
import TooltipSmall from "assets/icons/TooltipSmall"
import { GradientBorderBase } from "theme"

const TooltipStyles: any = createGlobalStyle`
  button {
    padding: 0;
  }

  .dark-tooltip {
    background: #181E2C!important;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08)!important;
    border-radius: 10px!important;
    border: 1px solid #223047!important;
    padding: 22px 18px 17px 13px!important;
    display: block!important;
    min-width: 300px;
    opacity: 1!important;
    max-width: 350px;

    &:before {
      display: none!important;
    }
    &:after {
      display: none!important;
    }
  }
  .gradient-border-tooltip {
    border-radius: 16px!important;
    border: none!important;
    padding: 12px!important;
    display: block!important;
    width: 300px;
    opacity: 1!important;

    ${GradientBorderBase}
    
    &:before {
      background-image: linear-gradient(
        to bottom right,
        #2680eb 0%,
        #7fffd4 40%,
        #2680eb 60%,
        #2680eb 100%
      );
      border: none !important;
      width: initial !important;
      height: initial !important;
      margin-top: initial !important;
      margin-right: initial !important;
      margin-bottom: initial !important;
      margin-left: initial !important;
      left: -1px !important;
      top:  -1px !important;
    }
    &:after {
      background: #181E2C;
      border: none !important;
      width: 100% !important;
      height: inherit !important;
      left: 0 !important;
      top:  0 !important;
      right:0;
      bottom:0;
      margin-top: initial !important;
      margin-right: initial !important;
      margin-bottom: initial !important;
      margin-left: initial !important;
    }
  }
`

const TooltipArea = styled.button`
  border: none;
  outline: none;
  background: none;
`

const TooltipContent = styled.div``

interface Props {
  id: string
  children?: ReactNode
  size?: "normal" | "small"
}

const Tooltip: React.FC<Props> = ({ id, children, size = "normal" }) => {
  const [tooltip, showTooltip] = useState(true)
  return (
    <>
      <TooltipStyles />
      <TooltipArea
        data-tip
        data-for={id}
        onMouseEnter={() => showTooltip(true)}
        onMouseLeave={() => {
          showTooltip(false)
          setTimeout(() => showTooltip(true), 50)
        }}
      >
        {size === "normal" ? <TooltipIcon /> : <TooltipSmall />}
      </TooltipArea>

      {tooltip && (
        <ReactTooltip
          className="dark-tooltip"
          effect="solid"
          id={id}
          getContent={() => {
            return <TooltipContent>{children}</TooltipContent>
          }}
        />
      )}
    </>
  )
}

export default Tooltip
