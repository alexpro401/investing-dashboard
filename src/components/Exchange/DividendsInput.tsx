import { Fragment } from "react"
import { BigNumberInput } from "big-number-input"

import TokenIcon from "components/TokenIcon"

import angleIcon from "assets/icons/angle-down.svg"

import { cutDecimalPlaces, formatBigNumber } from "utils"

import {
  InputContainer,
  InputTop,
  InputBottom,
  Price,
  Balance,
  Input,
  Tokens,
  Max,
  ActiveSymbol,
  SymbolLabel,
  Icon,
  ButtonDivider,
  AddButton,
} from "./styled"
import { DividendToken } from "interfaces"
import { Flex } from "theme"

interface Props {
  tokens: DividendToken[]
  onChange?: (amount: string, index: number) => void
  onSelect: (index: number) => void
}

const DividendsInput: React.FC<Props> = ({ tokens, onChange, onSelect }) => {
  const setMaxAmount = (index) => {
    !!onChange && onChange(tokens[index].balance.toString(), index)
  }

  const handleInputChange = (value, index) => {
    !!onChange && onChange(value || "0", index)
  }

  return (
    <InputContainer height="fit-content" gap="16px">
      {tokens.map(({ address, amount, data, price, balance }, index) => {
        return (
          <Fragment key={address}>
            <InputTop>
              <Price>≈${formatBigNumber(price, 18, 2)} </Price>

              <Balance onClick={() => setMaxAmount(index)}>
                <Tokens>{formatBigNumber(balance, data.decimals, 6)}</Tokens>
                <Max>Max</Max>
              </Balance>
            </InputTop>

            <InputBottom>
              <BigNumberInput
                decimals={data.decimals || 18}
                onChange={(value) => handleInputChange(value, index)}
                value={cutDecimalPlaces(
                  amount,
                  data.decimals,
                  false,
                  6
                ).toString()}
                renderInput={(props: any) => (
                  <Input disabled={!onChange} inputMode="decimal" {...props} />
                )}
              />

              <ActiveSymbol onClick={() => onSelect(index)}>
                <TokenIcon m="0" address={address} size={26} />
                <SymbolLabel>{data.symbol}</SymbolLabel>
                <Icon src={angleIcon} />
              </ActiveSymbol>
            </InputBottom>
            <Flex p="16px" full>
              <ButtonDivider />
            </Flex>
          </Fragment>
        )
      })}
      <AddButton onClick={() => onSelect(-1)}>+ Add more tokens</AddButton>
    </InputContainer>
  )
}

export default DividendsInput
