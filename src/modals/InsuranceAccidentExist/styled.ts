import styled from "styled-components"
import { AppButton } from "common"
import { Text } from "theme"

export const Image = styled.img`
  width: 140px;
  height: 96.6px;
  margin: 16px 0;
  mix-blend-mode: lighten;
`

export const Description = styled(Text)`
  font-size: 13px;
  line-height: 150%;
  color: #e4f2ff;
  text-align: center;

  @media screen and (min-width: 768px) {
    font-weight: 500;
    font-size: 14px;
    line-height: 170%;
    text-align: center;
    letter-spacing: 0.01em;

    color: #ffffff;
  }
`

export const VoteButton = styled(AppButton)`
  margin-top: 16px;

  @media screen and (min-width: 768px) {
    border-width: 0;
    margin-top: 32px;
  }
`
