import styled from "styled-components/macro"
import { InputField } from "fields"
import { Icon } from "common"

import { respondTo } from "theme"

export const Root = styled.div`
  ${respondTo("md")} {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
  }
`

export const TopInputField = styled(InputField)`
  input {
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  ${respondTo("md")} {
    width: 50%;

    input {
      border-top-left-radius: 16px;
      border-top-right-radius: 0px;
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 0px;
      border-right: none;
    }
  }
`

export const BottomInputField = styled.div`
  input {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
  }

  ${respondTo("md")} {
    width: 50%;

    input {
      border-top-left-radius: 0px;
      border-top-right-radius: 16px;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 16px;
    }
  }
`

export const SuccessLabelIcon = styled(Icon)`
  color: ${({ theme }) => theme.statusColors.success};
`
