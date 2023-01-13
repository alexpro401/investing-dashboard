import styled from "styled-components/macro"
import React, { useMemo } from "react"
import { Flex } from "theme"

import starDarkIcon from "assets/icons/star-dark.svg"
import starIcon from "assets/icons/star.svg"
import { useBreakpoints } from "../../../../../hooks"

export const Root = styled(Flex)`
  unicode-bidi: bidi-override;
  margin: 0 9px 0 4px;
`

export const RatingDesktop = styled.div`
  padding: 2px 6px;
  width: 32px;
  height: 19px;
  background: linear-gradient(41.86deg, #2680eb 0%, #7fffd4 117.98%);
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

const Rating: React.FC<{ rating?: number }> = ({ rating }) => {
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
    <Root>{isDesktop ? <RatingDesktop>{rating}/5</RatingDesktop> : stars}</Root>
  )
}

export default Rating
