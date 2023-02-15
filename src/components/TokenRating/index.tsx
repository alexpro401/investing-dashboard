import * as React from "react"
import * as S from "./styled"
import { useBreakpoints } from "hooks"

import starDarkIcon from "assets/icons/star-dark.svg"
import starIcon from "assets/icons/star.svg"

const TokenRating: React.FC<{ rating?: number }> = ({ rating, ...rest }) => {
  const { isDesktop } = useBreakpoints()

  const stars = React.useMemo(() => {
    const items = Array.from({ length: 5 }, (_, i) => i)

    if (!rating) {
      return items.map((number) => <S.Star key={number} src={starDarkIcon} />)
    }

    return items.map((number) => (
      <S.Star key={number} src={number >= rating ? starDarkIcon : starIcon} />
    ))
  }, [rating])

  return (
    <S.Root {...rest}>
      {isDesktop ? (
        <S.RatingDesktop rating={rating}>{rating}/5</S.RatingDesktop>
      ) : (
        stars
      )}
    </S.Root>
  )
}

export default TokenRating
