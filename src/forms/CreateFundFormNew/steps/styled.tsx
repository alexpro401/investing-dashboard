import styled from "styled-components/macro"

import { Collapse, Icon, SelectableCard } from "common"
import theme, { respondTo } from "theme"
import { InputField } from "fields"
import { ICON_NAMES } from "consts"
import { SelectableCardTitles } from "common/SelectableCard/styled"
import Slider from "components/Slider"

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

export const EmissionNodeRight = styled.div`
  color: #788ab4;
`

export const CheckIcon = styled(Icon).attrs({ name: ICON_NAMES.tileCheck })`
  & > circle {
    fill: none;
    stroke: ${theme.brandColors.secondary};
  }

  & > path {
    fill: none;
    stroke: ${theme.brandColors.secondary};
  }
`

export const FeeMobileCardWrp = styled(SelectableCard)`
  background-color: ${theme.textColors.secondaryNegative};
` as typeof SelectableCard

export const FeeCardWrp = styled(SelectableCard)`
  width: 33%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px 8px;
  gap: 8px;

  ${SelectableCardTitles} {
    align-items: center;
    justify-content: center;
  }
` as typeof SelectableCard

export const FeeSlider = styled(Slider)`
  position: relative;
  z-index: 12;
`
