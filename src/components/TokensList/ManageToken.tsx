import { FC, useMemo } from "react"
import { AppButton, Icon } from "common"
import { Token } from "lib/entities"

import TokenIcon from "components/TokenIcon"

import * as S from "./styled"
import ExternalLink from "components/ExternalLink"
import theme from "theme"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { ICON_NAMES } from "constants/icon-names"
import { useRemoveUserAddedToken } from "state/user/hooks"

interface Props {
  token: Token
}

const ManageToken: FC<Props> = ({ token }) => {
  const { symbol, name, address, chainId } = token
  const removeUserToken = useRemoveUserAddedToken()

  const viewLink = useMemo(
    () => (
      <ExternalLink
        color={theme.brandColors.secondary}
        iconColor={theme.textColors.secondary}
        href={getExplorerLink(chainId, address, ExplorerDataType.TOKEN)}
      >
        <S.Symbol>{symbol}</S.Symbol>
      </ExternalLink>
    ),
    [address, chainId, symbol]
  )

  const removeButton = useMemo(
    () => (
      <Icon
        name={ICON_NAMES.modalClose}
        onClick={() => removeUserToken(chainId, token.address)}
      />
    ),
    [chainId, removeUserToken, token.address]
  )

  return (
    <S.TokenContainer>
      <TokenIcon address={address} size={32} />
      <S.TokenInfo>
        {viewLink}
        <S.Name>{name}</S.Name>
      </S.TokenInfo>
      {removeButton}
    </S.TokenContainer>
  )
}

export default ManageToken
