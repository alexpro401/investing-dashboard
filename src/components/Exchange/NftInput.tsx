import { useMemo } from "react"
import { BigNumber } from "@ethersproject/bignumber"
import { ZERO } from "constants/index"

import Ripple from "components/Ripple"
import JazzIcon from "components/Icon/JazzIcon"
import NftRow from "components/NftRow"

import angleIcon from "assets/icons/angle-down.svg"

import { formatBigNumber } from "utils"

import * as S from "./styled"
import { AppButton } from "common"

interface IToProps {
  balance: BigNumber
  address: string
  selectedNfts: number[]
  nftPowerMap: Record<number, BigNumber>
  onSelect?: () => void
  onSelectAll?: () => void
}

const NftInput: React.FC<IToProps> = ({
  balance,
  address,
  selectedNfts,
  nftPowerMap,
  onSelectAll,
  onSelect,
}) => {
  const totalPower = useMemo(() => {
    return selectedNfts.reduce(
      (acc, id) => acc.add(nftPowerMap[id] || ZERO),
      ZERO
    )
  }, [nftPowerMap, selectedNfts])

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
        <S.Price>Voting power: {formatBigNumber(totalPower, 18, 2)}</S.Price>

        <S.Balance onClick={onSelectAll}>
          <S.Tokens>Available: {formatBigNumber(balance, 0, 0)}</S.Tokens>
          <S.Max>All</S.Max>
        </S.Balance>
      </S.InputTop>

      <S.InputBottom>
        {!selectedNfts.length ? (
          <AppButton
            type="button"
            color="default"
            size="no-paddings"
            onClick={onSelect}
            text={"Choose"}
          />
        ) : (
          <S.NftCounter>
            {selectedNfts.length} NFT{selectedNfts.length > 1 ? "s" : ""}
          </S.NftCounter>
        )}

        <S.ActiveSymbol onClick={onSelect}>
          <JazzIcon size={24} address={address || ""} />
          <S.SymbolLabel>ERC-721</S.SymbolLabel>
          {!!onSelect && <S.Icon src={angleIcon} />}
        </S.ActiveSymbol>
      </S.InputBottom>
      <S.TokensContainer gap="8" p={!selectedNfts.length ? "0" : "16px 0 0"}>
        {selectedNfts.map((id) => (
          <NftRow
            key={id}
            votingPower={nftPowerMap[id] || ZERO}
            tokenId={id.toString()}
            // TODO: add dynamic nft image
            tokenUri="https://public.nftstatic.com/static/nft/res/nft-cex/S3/1664823519694_jkjs8973ujyphjznjmmjd5h88tay9e0x.png"
          />
        ))}
      </S.TokensContainer>
    </S.InputContainer>
  )
}

export default NftInput
