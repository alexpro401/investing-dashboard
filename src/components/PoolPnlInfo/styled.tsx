import styled from "styled-components"
import { Flex, device } from "theme"

const Styled = {
  Row: styled(Flex)`
    width: 100%;
    padding: 0 16px 13px;
  `,
  Label: styled.div`
    font-family: Gilroy;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 130%;
    display: flex;
    align-items: center;
    color: #5a6071;
  `,
  Value: styled.div<{ c?: string }>`
    font-family: Gilroy;
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 16px;
    text-align: right;

    color: ${(p) => p.c ?? "#ffffff"};
  `,
}

export default Styled

const BarContainer = styled.div`
  background: #373e4d;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  border-radius: 4px;
  height: 4px;
  width: 100%;
`

const BarProgress = styled.div<{ w: number }>`
  background: linear-gradient(64.44deg, #63b49b 12.29%, #a4ebd4 76.64%);
  box-shadow: 0px 1px 4px rgba(164, 235, 212, 0.29),
    0px 2px 5px rgba(164, 235, 212, 0.14);
  border-radius: 2px;
  height: 4px;
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
