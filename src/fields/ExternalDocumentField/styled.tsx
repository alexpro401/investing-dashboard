import styled from "styled-components"
import { InputField } from "fields"
import { Icon } from "common"

export const Root = styled.div``

export const TopInputField = styled(InputField)`
  input {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`

export const BottomInputField = styled.div`
  input {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`

export const SuccessLabelIcon = styled(Icon)`
  color: ${({ theme }) => theme.statusColors.success};
`
