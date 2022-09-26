import * as S from "./styled"
import { FC, HTMLAttributes, useMemo } from "react"
import { ICON_NAMES } from "constants/icon-names"

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

  return (
    <S.Root {...rest}>
      <S.TokenChipSymbol title={name}>{symbol}</S.TokenChipSymbol>
      {iconUrl ? <S.TokenChipIcon src={iconUrl} /> : fallbackIcon}
      {link ? (
        <>
          <S.TokenChipIconDecor name={ICON_NAMES.externalLink} />
          <S.TokenChipLink target="_blank" href={link} />
        </>
      ) : (
        <></>
      )}
    </S.Root>
  )
}

export default TokenChip
