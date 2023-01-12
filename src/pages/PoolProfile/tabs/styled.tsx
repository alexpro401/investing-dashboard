import styled from "styled-components/macro"
import { Text } from "theme"
import { AppButton } from "common"

export const Label = styled(Text).attrs(() => ({
  color: "#B1C7FC",
  fz: 13,
  fw: 500,
  lh: "15px",
}))``

export const Value = {
  Big: styled(Text).attrs(() => ({
    fz: 16,
    fw: 700,
    lh: "19px",
  }))``,
  Medium: styled(Text).attrs(() => ({
    fz: 13,
    fw: 600,
    lh: "16px",
  }))``,
  MediumThin: styled(Text).attrs(() => ({
    fz: 13,
    fw: 500,
    lh: "19px",
  }))``,
}

export const Link = styled.a`
  display: block;
  width: 100%;
  text-decoration: none;
  color: initial;
`

export const AppButtonFull = styled(AppButton)`
  width: 100%;
`

export const AppLink = styled(AppButton).attrs(() => ({
  color: "default",
  size: "small",
}))`
  padding: 0;
  border-radius: 0;
`

export const GridTwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 48px;
`

const BarContainer = styled.div`
  background: #293c54;
  box-shadow: inset 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  height: 3px;
  width: 100%;
`

const BarProgress = styled.div<{ w: number }>`
  background: #7fffd4;
  box-shadow: 0 1px 4px rgba(164, 235, 212, 0.29),
    0 2px 5px rgba(164, 235, 212, 0.14);
  border-radius: 2px;
  height: 3px;
  width: ${(props) => props.w || 0}%;
  transition: width 0.3s ease-in-out;
`

export const ProgressBar = ({ w }) => {
  return (
    <BarContainer>
      <BarProgress w={w} />
    </BarContainer>
  )
}
