import styled from "styled-components/macro"

import { Flex } from "theme"
import { InputField } from "fields"

export const DesktopHeaderWrp = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
`

export const ButtonsContainer = styled(Flex)`
  width: fill-available;
  justify-content: space-around;
`

export const InputFieldWrp = styled(InputField)`
  padding-top: 16px;
` as typeof InputField
