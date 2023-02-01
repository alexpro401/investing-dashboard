import { AppButton } from "common"
import { ICON_NAMES } from "consts"
import styled, { css } from "styled-components/macro"
import { AddressBalanceField } from "fields"
import { fieldPaddings, getDefaultFieldBorderStyles } from "fields/styled"
import { respondTo } from "theme"

export const RefreshBtnIcon = styled(AppButton).attrs(() => ({
  iconLeft: ICON_NAMES.reload,
  color: "default",
  size: "no-paddings",
}))`
  color: ${(props) => props.theme.statusColors.success};
`

export const DisableBtnIcon = styled(AppButton).attrs(() => ({
  iconLeft: ICON_NAMES.trash,
  color: "default",
  size: "no-paddings",
}))``

export const AddressBalanceFieldWrp = styled(AddressBalanceField)<{
  isItemDisabled: boolean
}>`
  ${(props) =>
    props.isItemDisabled
      ? css`
          opacity: 0.5;
        `
      : ""}
`

export const AddressBalanceAddBtn = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  outline: none;
  padding: ${fieldPaddings};
  color: ${(props) => props.theme.brandColors.secondary};
  cursor: pointer;

  ${getDefaultFieldBorderStyles};
`

export const AddressBalanceAddBtnStubWrp = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-columns: clamp(50px, 25%, 100px) max-content;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`

export const AddressBalanceAddBtnInputStub = styled.span`
  background: transparent;
  border: none;
  outline: none;
  text-align: right;
  font-size: 16px;
  line-height: 1.2;
  font-weight: 500;
  color: ${(props) => props.theme.textColors.primary};

  &:focus {
    outline: none;
  }
`

export const AddressBalanceAddBtnSymbolStub = styled.span`
  display: block;
  font-size: 16px;
  line-height: 1.2;
  font-weight: 500;
  color: ${(props) => props.theme.textColors.secondary};
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

export const HeadResetBtn = styled(AppButton).attrs(() => ({
  color: "default",
  size: "no-paddings",
}))`
  text-align: right;
  color: ${(props) => props.theme.statusColors.error};
  font-size: 13px;
  line-height: 1.2;
  font-weight: 600;
`
