import styled from "styled-components/macro"
import React, { useMemo } from "react"
import theme, { Flex } from "theme"

import starDarkIcon from "assets/icons/star-dark.svg"
import starIcon from "assets/icons/star.svg"
import { useBreakpoints } from "hooks"

type RatingProps = {
  rating?: number
}

function getRatingBg({ rating }: RatingProps) {
  if (!rating || rating >= 4) {
    return "linear-gradient(41.86deg, #2680eb 0%, #7fffd4 117.98%)"
  } else if (rating >= 3) {
    return theme.statusColors.warning
  } else {
    return theme.statusColors.error
  }
}

export const Root = styled(Flex)`
  unicode-bidi: bidi-override;
  margin: 0 9px 0 4px;
`

export const RatingDesktop = styled.div<RatingProps>`
  padding: 2px 6px;
  width: 32px;
  height: 19px;
  background: ${({ rating }) => getRatingBg({ rating })};
  border-radius: 26px;

  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  color: #141926;
`

export const Star = styled.img`
  position: relative;
  width: 10.51px;
  height: 10.44px;

  &:not(:last-child) {
    margin-right: 2.5px;
  }
`

const Rating: React.FC<RatingProps> = ({ rating }) => {
  const { isDesktop } = useBreakpoints()

  const stars = useMemo(() => {
    const items = Array(5).fill(null)

    if (!rating) {
      return items.map((_, i) => <Star key={i} src={starDarkIcon} />)
    }

    return items.map((_, i) => (
      <Star key={i} src={i >= rating ? starDarkIcon : starIcon} />
    ))
  }, [rating])

  return (
    <Root>
      {isDesktop ? (
        <RatingDesktop rating={rating}>{rating}/5</RatingDesktop>
      ) : (
        stars
      )}
    </Root>
  )
}

export default Rating
