import styled from "styled-components"

import { Flex } from "theme"

export const StepsRoot = styled.div`
  display: flex;
  flex-direction: column;
  transform: scale(1);
  gap: 16px;
  padding: 14px 16px 20px;
  flex: 1;
  width: 100%;
`

export const ButtonsContainer = styled(Flex)`
  width: fill-available;
  justify-content: space-around;
`
