import styled from "styled-components/macro"
import { motion } from "framer-motion"
import { FC, MouseEvent, ReactNode, useMemo } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import { normalizeBigNumber } from "utils"

import Amount from "components/Amount"
import { accordionSummaryVariants } from "motion/variants"
import { ColorizedNumber, Flex, GradientBorder, respondTo } from "theme"

import shareIcon from "assets/icons/share.svg"
import { isNil } from "lodash"
import { useBreakpoints } from "hooks"
import { AppButton } from "common"

const Styled = {
  Container: styled.div``,
  Card: styled(GradientBorder)<{ showPositions: boolean }>`
    width: 100%;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    flex-direction: column;
    cursor: pointer;

    &::after {
      background: ${({ theme }) => theme.backgroundColors.secondary};
      ${respondTo("lg")} {
        background: #141926;
      }
    }

    &::before {
      ${respondTo("lg")} {
        background: transparent;
      }
    }

    ${respondTo("lg")} {
      flex-direction: row;
      box-shadow: none;
      border-radius: ${({ showPositions }) =>
        showPositions ? "16px 16px 0 0" : "16px"};
    }
  `,
  Head: styled(Flex)`
    width: 100%;
    padding: 8px 16px;
    justify-content: space-between;
    flex-wrap: wrap;
    border-bottom: 1px solid #1d2635;

    ${respondTo("lg")} {
      display: none;
    }
  `,
  Body: styled.div`
    width: 100%;
    padding: 12px 16px;
    display: grid;
    grid-template-columns: 0.34fr 0.38fr 0.28fr;
    grid-template-rows: 1fr;
    grid-column-gap: 12px;
    overflow-x: auto;

    ${respondTo("lg")} {
      display: flex;
      flex-direction: row;

      & > * {
        flex: 1 0 155px;
      }
    }
  `,
  TradesList: styled.div`
    max-height: 180px;
    overflow-y: auto;

    -webkit-overflow-scrolling: touch;
    ::-webkit-scrollbar {
      display: none;
    }

    ${respondTo("lg")} {
      max-height: initial;
      overflow-y: initial;
    }
  `,
  ExtraItem: styled(GradientBorder)<{ p?: string }>`
    width: 100%;
    flex-direction: column;
    border-radius: 20px;
    margin-top: 8px;
    padding: ${(props) => (props.p ? props.p : "0")};

    &::after {
      background: #181e2c;
    }

    ${respondTo("lg")} {
      margin-top: 0;
      border-radius: 0 0 20px 20px;
      &::after {
        background: #141926;
      }
      &::before {
        background: transparent;
      }
    }
  `,
  PNL: styled(ColorizedNumber)`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 600;
    line-height: 100%;
    letter-spacing: 0.01em;
    margin-left: 4px;
    font-size: 12px;
    transform: translateY(2px);

    ${respondTo("lg")} {
      align-self: flex-end;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 500;
      font-size: 12px;
      line-height: 14px;
      padding: 2px 8px;
      width: auto;

      color: #e4f2ff;

      background: ${(props) => (props.value > 0 ? "#337833" : "#68282C")};
      border-radius: 5px;
    }
  `,
  ActionBuy: styled(AppButton)`
    font-size: 14px;
    line-height: 17px;
    color: #5baa99;
  `,
  ActionSell: styled(AppButton)`
    font-size: 14px;
    line-height: 17px;
    color: #a75b5b;
  `,
}

export default Styled

export const BodyItemStyled = {
  Label: styled.div`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 100%;
    letter-spacing: 0.03em;
    color: #788ab4;
    margin-bottom: 8px;
  `,

  PNL: styled.div<{ positive?: boolean }>`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 600;
    line-height: 100%;
    letter-spacing: 0.01em;
    margin-left: 4px;
    font-size: 12px;
    color: ${(props) => (props.positive ? "#83e5ca" : "#DB6D6D")};
  `,

  StablePrice: styled.div`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 100%;
    color: #788ab4;
    margin-top: 8px;

    ${respondTo("lg")} {
      font-weight: 500;
      font-size: 12px;
      line-height: 14px;
      margin-top: 4px;
    }
  `,
}

const getAmountSymbol = (amount) => {
  if (amount === 0) {
    return ""
  }

  if (amount > 0) {
    return "+"
  }

  return "-"
}

interface IBodyItemProps {
  label?: ReactNode
  amount: BigNumber
  symbol?: string
  pnl?: BigNumber
  amountUSD: BigNumber
  ai?: string
}

export const BodyItem: FC<IBodyItemProps> = ({
  label,
  amount,
  symbol,
  pnl,
  amountUSD,
  ai,
}) => {
  const stablePrice = useMemo(() => {
    if (!amountUSD) return null
    return normalizeBigNumber(amountUSD, 18, 2)
  }, [amountUSD])

  const { isDesktop } = useBreakpoints()

  return (
    <Flex
      full={!isDesktop}
      dir="column"
      ai={ai ?? "flex-start"}
      jc={isDesktop ? "flex-start" : "initial"}
    >
      {!isNil(label) && <BodyItemStyled.Label>{label}</BodyItemStyled.Label>}
      <Flex>
        <Amount
          value={
            <>
              {pnl && getAmountSymbol(Number(amount))}
              {Math.abs(Number(normalizeBigNumber(amount, 18, 4)))}
            </>
          }
          symbol={symbol}
          fz={isDesktop ? "16px" : "13px"}
          lh={isDesktop ? "19px" : "16px"}
        />
      </Flex>
      <BodyItemStyled.StablePrice>
        {pnl && getAmountSymbol(Number(stablePrice))}$
        {Math.abs(Number(stablePrice))}
      </BodyItemStyled.StablePrice>
    </Flex>
  )
}

const ActionsStyled = {
  Content: styled(Flex)`
    width: 100%;
    justify-content: space-between;
    margin: 8px 0 0;
  `,
  Item: styled(GradientBorder)<{ active?: boolean }>`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 15px;
    padding: 8px 12px;
    border-radius: 23px;
    color: ${(props) => (props.active ? "#E4F2FF" : "#788AB4")};
    cursor: pointer;

    &:after {
      background: #08121a;
    }
  `,
}

interface IAction {
  label: string
  active?: boolean
  onClick: (e: MouseEvent<HTMLElement>) => void
}

interface IActionsProps {
  actions: IAction[]
  visible: boolean
}

export const Actions: FC<IActionsProps> = ({ actions, visible, ...rest }) => {
  if (!actions.length) return null

  return (
    <motion.div
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={accordionSummaryVariants}
      {...rest}
    >
      <ActionsStyled.Content>
        {actions.map((a, i) => (
          <ActionsStyled.Item key={i} active={a.active} onClick={a.onClick}>
            {a.label}
          </ActionsStyled.Item>
        ))}
      </ActionsStyled.Content>
    </motion.div>
  )
}

const ShareStyled = {
  Container: styled(Flex)`
    width: 26px;
    height: 26px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  `,
  Icon: styled.img`
    width: 12px;
    height: 13px;
  `,
}

interface IShare {
  onClick: (e: MouseEvent<HTMLElement>) => void
}

export const Share: FC<IShare> = ({ onClick }) => {
  return (
    <ShareStyled.Container onClick={onClick}>
      <ShareStyled.Icon src={shareIcon} />
    </ShareStyled.Container>
  )
}
