import styled from "styled-components/macro"
import { AppButton } from "common"
import { respondTo } from "theme"

export const InputNodeRightElement = styled.div`
  color: #788ab4;
`

export const FormSubmitBtn = styled(AppButton).attrs(() => ({
  color: "tertiary",
}))`
  border: none;
  margin-top: auto;
  width: 100%;

  ${respondTo("xs")} {
    margin-top: 0;
  }
`
