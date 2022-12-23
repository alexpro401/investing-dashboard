import styled from "styled-components/macro"
import React, { useMemo } from "react"
import { Flex } from "theme"

import starDarkIcon from "assets/icons/star-dark.svg"
import starIcon from "assets/icons/star.svg"

export const Root = styled(Flex)`
  unicode-bidi: bidi-override;
  margin: 0 9px 0 4px;
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
  const stars = useMemo(() => {
    const items = Array(5).fill(null)

    if (!rating) {
      return items.map((_, i) => <Star key={i} src={starDarkIcon} />)
    }

    return items.map((_, i) => (
      <Star key={i} src={i >= rating ? starDarkIcon : starIcon} />
    ))
  }, [rating])

  return <Root>{stars}</Root>
}

export default Rating
