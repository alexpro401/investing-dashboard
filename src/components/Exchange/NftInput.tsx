import { BigNumber } from "@ethersproject/bignumber"

import Ripple from "components/Ripple"

import angleIcon from "assets/icons/angle-down.svg"

import { formatBigNumber } from "utils"

import {
  InputContainer,
  InputTop,
  InputBottom,
  Price,
  Balance,
  Tokens,
  Max,
  ActiveSymbol,
  SymbolLabel,
  Icon,
} from "./styled"
import JazzIcon from "components/Icon/JazzIcon"

interface IToProps {
  price: BigNumber
  balance: BigNumber
  address: string
  onChange?: (amount: string) => void
  onSelect?: () => void
}

const NftInput: React.FC<IToProps> = ({
  price,
  balance,
  address,
  onChange,
  onSelect,
}) => {
  const setMaxAmount = () => {
    !!onChange && onChange(balance.toString())
  }

  if (!address) {
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

  return (
    <InputContainer>
      <InputTop>
        <Price>${formatBigNumber(price, 18, 2)} </Price>

        <Balance onClick={setMaxAmount}>
          <Tokens>Available: {formatBigNumber(balance, 18, 0)}</Tokens>
          <Max>All</Max>
        </Balance>
      </InputTop>

      <InputBottom>
        {/* button "choose" or total nft count */}

        <ActiveSymbol onClick={onSelect}>
          <JazzIcon size={24} address={address || ""} />
          <SymbolLabel>ERC-721</SymbolLabel>
          {!!onSelect && <Icon src={angleIcon} />}
        </ActiveSymbol>
      </InputBottom>
    </InputContainer>
  )
}

export default NftInput
