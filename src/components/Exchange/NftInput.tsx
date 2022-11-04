import { BigNumber } from "@ethersproject/bignumber"
import { ZERO } from "constants/index"

import Ripple from "components/Ripple"
import JazzIcon from "components/Icon/JazzIcon"
import NftRow from "components/NftRow"

import angleIcon from "assets/icons/angle-down.svg"

import { formatBigNumber } from "utils"

import * as S from "./styled"

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
      <S.InputContainer>
        <S.InputTop>
          <S.Price>
            <Ripple width="67px" />
          </S.Price>
          <S.Balance>
            <Ripple width="80px" />
          </S.Balance>
        </S.InputTop>
        <S.InputBottom>
          <Ripple width="120px" />
          <Ripple width="60px" />
        </S.InputBottom>
      </S.InputContainer>
    )
  }

  return (
    <S.InputContainer height="fit-content">
      <S.InputTop>
        <S.Price>Voting power: {formatBigNumber(price, 18, 2)}</S.Price>

        <S.Balance onClick={setMaxAmount}>
          <S.Tokens>Available: {formatBigNumber(balance, 0, 0)}</S.Tokens>
          <S.Max>All</S.Max>
        </S.Balance>
      </S.InputTop>

      <S.InputBottom>
        <S.NftCounter>2 NFT</S.NftCounter>

        <S.ActiveSymbol onClick={onSelect}>
          <JazzIcon size={24} address={address || ""} />
          <S.SymbolLabel>ERC-721</S.SymbolLabel>
          {!!onSelect && <S.Icon src={angleIcon} />}
        </S.ActiveSymbol>
      </S.InputBottom>
      <S.TokensContainer gap="8" p="16px 0 0">
        <NftRow
          votingPower={ZERO}
          tokenId="1"
          tokenUri="https://public.nftstatic.com/static/nft/res/nft-cex/S3/1664823519694_jkjs8973ujyphjznjmmjd5h88tay9e0x.png"
        />
        <NftRow
          isLocked
          votingPower={ZERO}
          tokenId="1"
          tokenUri="https://public.nftstatic.com/static/nft/res/nft-cex/S3/1664823519694_jkjs8973ujyphjznjmmjd5h88tay9e0x.png"
        />
      </S.TokensContainer>
    </S.InputContainer>
  )
}

export default NftInput
