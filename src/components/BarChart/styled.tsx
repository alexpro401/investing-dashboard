import { useMemo } from "react"
import styled from "styled-components"
import { Flex, getAmountColor, GradientBorder } from "theme"

function getTop(r) {
  if (r === null || r > 0) {
    return "0"
  }

  return "50%"
}
function getBottom(r) {
  if (r === null || r > 0) {
    return "50%"
  }

  if (r < 0) {
    return "0"
  }

  return "49%"
}
function getBg(r) {
  if (r === null) {
    return "transparent"
  }

  if (r > 0) {
    return "linear-gradient(179.35deg, #63B49B 1.92%, #63B49B 1.93%, #A4EBD4 99.53%)"
  }
  if (r < 0) {
    return "linear-gradient(267.88deg, #D75E65 -0.85%, #E77171 98.22%)"
  }

  return "#788AB4"
}
function getBr(r) {
  if (!r || r === null) {
    return "0"
  }

  if (r > 0) {
    return "4px 4px 0 0"
  }
  if (r < 0) {
    return "0 0 4px 4px"
  }

  return "#ffffff"
}

const Styled = {
  Container: styled(Flex)`
    width: 100%;
    justify-content: space-evenly;
    margin: 44px 0 22px;
  `,
  Tip: styled.img`
    position: absolute;
    top: -50px;
    left: -13px;
    height: 46px;
    width: 129px;
    display: none;
  `,
  Bar: styled.div<{ active?: boolean; perc: number | null }>`
    position: relative;
    box-shadow: inset 1px 2px 2px 2px rgba(0, 0, 0, 0.2);
    width: 16px;
    height: 40px;
    background: rgba(60, 66, 78, 0.5);
    border-radius: 4px;

    &::after {
      content: "";
      position: absolute;
      left: 0px;
      right: 0px;
      top: ${(p) => getTop(p.perc)};
      bottom: ${(p) => getBottom(p.perc)};
      background: ${(p) => getBg(p.perc)};
      display: ${(p) => (p.perc !== null ? "block" : "none")};
      border-radius: ${(p) => getBr(p.perc)};
      transition: top 0.3s ease-in-out, bottom 0.3s ease-in-out,
        background 0.3s ease-in-out;
    }
  `,
}

export default Styled

const TipS = {
  Container: styled(Flex)<{ mon: number }>`
    position: absolute;
    top: -48px;
    left: ${(p) => (p.mon > 7 ? "initial" : "0")};
    right: ${(p) => (p.mon > 7 ? "0" : "initial")};
  `,
  Content: styled(GradientBorder)`
    padding: 12px 8px;
    width: max-content;
    border-radius: 12px;

    &:after {
      background: #181e2c;
    }
  `,
  Dot: styled.div<{ color: string }>`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${(p) => p.color};
    flex: 0 0 auto;
  `,
  Month: styled.div`
    margin: 0 6px;
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 500;
    font-size: 11px;
    line-height: 13px;
    color: #eeecf1;
    flex: 0 0 auto;
  `,
  PNL: styled.div<{ pnl: number }>`
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 500;
    font-size: 11px;
    line-height: 13px;
    color: ${(p) => getAmountColor(p.pnl, "#788AB4")};
    flex: 0 0 auto;
  `,
}

interface IProps {
  id: number
  pnl: number
  timestamp: number
}

export const Tip: React.FC<IProps> = ({ id, timestamp, pnl, ...rest }) => {
  const month = useMemo(() => {
    if (!timestamp) return ""

    const formatter = new Intl.DateTimeFormat("en", { month: "short" })
    return formatter.format(new Date(timestamp))
  }, [timestamp])

  return (
    <TipS.Container mon={id} {...rest}>
      <TipS.Content>
        <TipS.Dot color={getBg(Number(pnl))} />
        <TipS.Month>{month}</TipS.Month>
        <TipS.PNL pnl={pnl}>{`${pnl > 0 ? "+ " : ""}${pnl}%`}</TipS.PNL>
      </TipS.Content>
    </TipS.Container>
  )
}
