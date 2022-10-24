import { FC, useMemo } from "react"
import { AppButton } from "common"
import { Token } from "lib/entities"

import TokenIcon from "components/TokenIcon"

import * as S from "./styled"
import ExternalLink from "components/ExternalLink"
import theme from "theme"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"

interface Props {
  token: Token
  importing?: boolean
  importToken: (token: Token) => void
}

const ImportRow: FC<Props> = ({ token, importing, importToken }) => {
  const { symbol, name, address, chainId } = token

  const viewLink = useMemo(
    () => (
      <ExternalLink
        color={theme.brandColors.secondary}
        iconColor={theme.brandColors.secondary}
        href={getExplorerLink(chainId, address, ExplorerDataType.TOKEN)}
      >
        View on bscscan
      </ExternalLink>
    ),
    [address, chainId]
  )

  const importButton = useMemo(
    () => (
      <AppButton
        onClick={() => importToken(token)}
        size="x-small"
        text="Import"
      />
    ),
    [importToken, token]
  )

  return (
    <S.TokenContainer>
      <TokenIcon address={address} size={32} />
      <S.TokenInfo>
        <S.Symbol>{symbol}</S.Symbol>
        <S.Name>{name}</S.Name>
      </S.TokenInfo>
      {!importing && importButton}
      {importing && viewLink}
    </S.TokenContainer>
  )
}

export default ImportRow
