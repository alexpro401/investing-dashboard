import { FC, HTMLAttributes } from "react"
import { BigNumber, BigNumberish } from "@ethersproject/bignumber"

import * as S from "./styled"
import NftIcon from "components/NftIcon"
import TokenIcon from "components/TokenIcon"

import { normalizeBigNumber } from "utils"
import { INftTile } from "interfaces/exchange"
import { useERC20Data } from "state/erc20/hooks"
import { ZERO } from "consts"
import theme from "theme"

interface Props extends Omit<INftTile, "votingPower"> {
  isLocked?: boolean
  delegated: BigNumberish
  available: BigNumber
}

/**
  ERC20Row component - UI representation of token row in the list of DAO assets

  @param isLocked - used to show if the token is used in voting
  @param delegated - amount of the delegated tokens
  @param available - amount of the available tokens
  @param tokenId - used to show the tokenId of the token
*/
const ERC20Row: FC<Props & HTMLAttributes<HTMLDivElement>> = ({
  delegated,
  available,
  tokenId,
  isLocked,
  ...rest
}) => {
  const [tokenData] = useERC20Data(tokenId)

  return (
    <S.Container {...rest}>
      <div>
        <S.Value color={theme.textColors.primary}>
          {normalizeBigNumber(delegated, 18, 2)}
        </S.Value>
        {available.gt(ZERO) && (
          <>
            <S.Value color={theme.textColors.primary}>&nbsp;/&nbsp;</S.Value>
            <S.Value color={theme.statusColors.success}>
              {normalizeBigNumber(available, 18, 2)}
            </S.Value>
          </>
        )}
      </div>
      <S.RightNode>
        <S.TokenId>{tokenData?.symbol ?? ""}</S.TokenId>
        <NftIcon
          round
          url={""}
          isLocked={isLocked}
          iconNode={<TokenIcon size={32} address={tokenId} m={"0"} />}
        />
      </S.RightNode>
    </S.Container>
  )
}

export default ERC20Row
