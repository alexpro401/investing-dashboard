import { FC, ReactNode, useMemo } from "react"
import styled, { css } from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import ReactTooltip from "react-tooltip"

import { Flex } from "theme"

import traderBadgeDangerIcon from "assets/icons/trader-badge-danger.svg"
import traderBadgeWarningIcon from "assets/icons/trader-badge-warning.svg"
import traderBadgeSuccessIcon from "assets/icons/trader-badge-success.svg"

const TraderInfoBadgeStyled = {
  Container: styled.div`
    width: 10px;
    height: 10px;
    position: absolute;
    bottom: 0;
    right: 0;
  `,
  Icon: styled.img`
    width: 10px;
    height: 10px;
  `,
  Content: styled.div`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 130%;
    text-align: center;
    letter-spacing: 0.03em;
    color: #e4f2ff;
  `,
}

function getTraderBadgeIcon(quality) {
  switch (quality) {
    case "danger":
      return traderBadgeDangerIcon
    case "warning":
      return traderBadgeWarningIcon
    case "success":
    default:
      return traderBadgeSuccessIcon
  }
}

interface ITraderInfoBadge {
  id: string
  quality?: string
  content?: ReactNode
}

const TraderInfoBadge: FC<ITraderInfoBadge> = ({ id, quality, content }) => {
  return (
    <>
      <TraderInfoBadgeStyled.Container>
        <TraderInfoBadgeStyled.Icon src={getTraderBadgeIcon(quality)} />
      </TraderInfoBadgeStyled.Container>
      <ReactTooltip id={id} className="gradient-border-tooltip" place="bottom">
        <TraderInfoBadgeStyled.Content>{content}</TraderInfoBadgeStyled.Content>
      </ReactTooltip>
    </>
  )
}

export default TraderInfoBadge
