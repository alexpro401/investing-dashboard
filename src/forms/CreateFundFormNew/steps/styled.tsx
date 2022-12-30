import styled from "styled-components/macro"

import { Icon } from "common"
import theme, { respondTo } from "theme"
import { InputField } from "fields"

export const DesktopHeaderWrp = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
`

export const CreateFundDaoAvatarActions = styled.div`
  display: flex;
  flex-direction: column;
`

export const CreateFundDaoAvatarBtn = styled.button`
  background: none;
  color: ${theme.brandColors.secondary};
  font-size: 13px;
  line-height: 1.2;
  font-weight: 600;
  border: none;
  margin-top: 8px;
`

export const FieldValidIcon = styled(Icon)`
  color: ${(props) => props.theme.statusColors.success};
`

export const FundSettingsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${respondTo("md")} {
    flex-direction: row;
  }
`

export const FundSettingField = styled(InputField)`
  ${respondTo("md")} {
    width: 50%;
  }
` as typeof InputField

export const BaseTokenIconWrp = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px;

  svg {
    color: ${theme.textColors.primary};
  }
`

export const BaseTokenPlaceholder = styled.span`
  color: #788ab4;
`
