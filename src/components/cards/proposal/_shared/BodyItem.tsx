import { FC, ReactNode } from "react"
import styled from "styled-components/macro"
import { Flex } from "theme"
import Amount from "components/Amount"
import checkGreenIcon from "assets/icons/green-check.svg"

export const BodyItemStyled = {
  Container: styled(Flex)<{ ai: string }>`
    width: 100%;
    flex-direction: column;
    align-items: ${(props) => props.ai};
    justify-content: flex-start;
  `,
  Label: styled(Flex)`
    min-height: 16px;
    align-items: center;
    margin-bottom: 2px;
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 400;
    font-size: 11px;
    line-height: 100%;
    letter-spacing: 0.03em;
    color: #616d8b;
  `,
}

interface IBodyItemProps {
  label: ReactNode
  amount: ReactNode
  symbol?: ReactNode
  fz?: string
  ai?: string
  completed?: boolean
}

const BodyItem: FC<IBodyItemProps> = ({
  label,
  amount,
  symbol,
  fz,
  ai,
  completed = false,
}) => (
  <BodyItemStyled.Container ai={ai ?? "flex-start"}>
    <BodyItemStyled.Label>
      {label}
      {completed && <img src={checkGreenIcon} />}
    </BodyItemStyled.Label>
    <Amount value={amount} symbol={symbol} fz={fz} />
  </BodyItemStyled.Container>
)

export default BodyItem
