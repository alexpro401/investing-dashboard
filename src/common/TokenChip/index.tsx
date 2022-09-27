import * as S from "./styled"
import { FC, HTMLAttributes, useMemo } from "react"
import ExternalLink from "components/ExternalLink"

interface Props extends HTMLAttributes<HTMLDivElement> {
  name: string
  symbol: string
  iconUrl?: string
  link?: string
}

const TokenChip: FC<Props> = ({
  name,
  symbol,
  iconUrl = "",
  link,
  ...rest
}) => {
  const fallbackIcon = useMemo(() => {
    const firstLetter = symbol[0].toUpperCase()

    return <S.TokenChipFallbackIcon>{firstLetter}</S.TokenChipFallbackIcon>
  }, [symbol])

  const TokenChipInnerContent = useMemo(
    () => (
      <S.Root {...rest}>
        <S.TokenChipSymbol title={name}>{symbol}</S.TokenChipSymbol>
        {iconUrl ? <S.TokenChipIcon src={iconUrl} /> : fallbackIcon}
      </S.Root>
    ),
    [fallbackIcon, iconUrl, name, rest, symbol]
  )

  return link ? (
    <ExternalLink href={link}>{TokenChipInnerContent}</ExternalLink>
  ) : (
    TokenChipInnerContent
  )
}

export default TokenChip
