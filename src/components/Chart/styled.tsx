import styled from "styled-components/macro"
import { Flex } from "theme"

export const Container = styled(Flex)`
  width: 100%;
  gap: 16px;
`

export const ChartWrapper = styled.div<{ h?: string }>`
  width: inherit;
  height: ${({ h }) => h ?? "120px"};

  @media screen and (min-width: 768px) {
    height: ${({ h }) => h ?? "180px"};
  }
`

export const ChartTimeframeWrapper = styled.div`
  width: inherit;

  @media screen and (min-width: 768px) {
    width: 255px;
  }
`
