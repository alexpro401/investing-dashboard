import styled from "styled-components/macro"
import { Flex } from "theme"

export const Container = styled(Flex)<{ h?: string }>`
  width: 100%;
  height: ${({ h }) => h ?? "120px"};
  gap: 16px;
`
