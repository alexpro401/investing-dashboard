import { ReactNode } from "react"
import { BigNumber } from "@ethersproject/bignumber"
import { BigNumberInput } from "big-number-input"

import TokenIcon from "components/TokenIcon"
import Ripple from "components/Ripple"

import angleIcon from "assets/icons/angle-down.svg"
import locker from "assets/icons/locker.svg"

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
  SelectToken,
  SymbolLabel,
  Icon,
} from "./styled"

interface IToProps {
  price: BigNumber
  amount: string
  balance: BigNumber
  address?: string
  symbol?: string
  decimal?: number
  priceImpact?: string
  customIcon?: ReactNode
  customPrice?: ReactNode
  customBalance?: ReactNode
  isLocked?: boolean
  onChange?: (amount: string) => void
  onSelect?: () => void
}

const ExchangeInput: React.FC<IToProps> = ({
  price,
  amount,
  balance,
  address,
  symbol,
  decimal,
  priceImpact,
  customIcon,
  customPrice,
  customBalance,
  isLocked,
  onChange,
  onSelect,
}) => {
  const noData = !decimal || !symbol

  const setMaxAmount = () => {
    !!onChange && onChange(balance.toString())
  }

  const handleInputChange = (value) => {
    !!onChange && onChange(value || "0")
  }

  if (!onSelect && noData) {
    return (
      <InputContainer>
        <InputTop>
          <Price>
            <Ripple width="67px" />
          </Price>
          <Balance>
            <Ripple width="80px" />
          </Balance>
        </InputTop>
        <InputBottom>
          <Ripple width="120px" />
          <Ripple width="60px" />
        </InputBottom>
      </InputContainer>
    )
  }

  const icon = customIcon ? (
    customIcon
  ) : (
    <TokenIcon m="0" address={address} size={26} />
  )

  return (
    <InputContainer>
      <InputTop>
        {customPrice ? (
          customPrice
        ) : (
          <Price>
            ≈${formatBigNumber(price, 18, 2)}{" "}
            {priceImpact && <>({priceImpact}%)</>}
          </Price>
        )}

        {customBalance || (
          <Balance onClick={setMaxAmount}>
            <Tokens>{formatBigNumber(balance, decimal, 6)}</Tokens>
            {!!onChange && <Max>Max</Max>}
          </Balance>
        )}
      </InputTop>

      <InputBottom>
        <BigNumberInput
          decimals={decimal || 18}
          onChange={handleInputChange}
          value={cutDecimalPlaces(amount, decimal, false, 6).toString()}
          renderInput={(props: any) => (
            <Input disabled={!onChange} inputMode="decimal" {...props} />
          )}
        />

        <ActiveSymbol onClick={onSelect}>
          {!noData && icon}
          {noData ? (
            <SelectToken>Select Token</SelectToken>
          ) : (
            <SymbolLabel>{symbol}</SymbolLabel>
          )}
          {!!onSelect && !isLocked && <Icon src={angleIcon} />}
          {isLocked && <Icon src={locker} />}
        </ActiveSymbol>
      </InputBottom>
    </InputContainer>
  )
}

export default ExchangeInput
