import styled from "styled-components/macro"
import theme, { Flex } from "theme"

type RatingProps = {
  rating?: number
}

function getRatingBg(rating?: number) {
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
`

export const RatingDesktop = styled.div<RatingProps>`
  padding: 2px 6px;
  width: 32px;
  height: 19px;
  background: ${({ rating }) => getRatingBg(rating)};
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
