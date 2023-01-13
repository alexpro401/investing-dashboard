import { FC, ReactNode } from "react"
import styled from "styled-components/macro"
import { Flex, respondTo } from "theme"
import checkGreenIcon from "assets/icons/green-check.svg"

export const BodyItemStyled = {
  Container: styled(Flex)<{ ai: string }>`
    width: 100%;
    flex-direction: column;
    align-items: ${(props) => props.ai};
    justify-content: flex-start;

    ${respondTo("lg")} {
      align-items: flex-start;
    }
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

    ${respondTo("lg")} {
      font-size: 12px;
      line-height: 14px;
      color: #6781bd;
    }
  `,
  ValueWrp: styled.div`
    display: flex;
    min-height: 20px;
  `,
  Value: styled.span<{ fz?: string }>`
    font-size: ${(props) => props.fz ?? "13px"};
    font-weight: 600;
    line-height: 20px;
    color: ${({ theme }) => theme.textColors.primary};

    ${respondTo("lg")} {
      font-size: 16px;
      font-weight: 700;
      line-height: 19px;
    }
  `,
  ValueSymbol: styled.span`
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    color: #788ab4;

    ${respondTo("lg")} {
      font-size: 16px;
      font-weight: 700;
      line-height: 19px;
    }
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
    <BodyItemStyled.ValueWrp>
      <BodyItemStyled.Value fz={fz}>{amount}</BodyItemStyled.Value>
      {symbol && (
        <BodyItemStyled.ValueSymbol>&nbsp;{symbol}</BodyItemStyled.ValueSymbol>
      )}
    </BodyItemStyled.ValueWrp>
  </BodyItemStyled.Container>
)

export default BodyItem
