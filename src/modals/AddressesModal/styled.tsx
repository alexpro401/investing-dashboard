import styled from "styled-components/macro"

import Modal from "components/Modal"
import theme from "theme"
import { AppButton, Icon } from "common"

export const ModalWrp = styled(Modal)``

export const Content = styled.div`
  width: calc(100% - 32px);
  padding: 16px;
  padding-top: 0px;
  font-family: ${(props) => props.theme.appFontFamily};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-height: calc(100vh - 200px);
  overflow: hidden;
`

export const DescriptionWrp = styled.div`
  width: 100%;
  color: ${theme.textColors.secondary};
  font-size: 14px;
  line-height: 170%;
  font-family: ${(props) => props.theme.appFontFamily};
  font-weight: 500px;
`

export const AddressesActions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const AddressesDeleteButton = styled(AppButton)`
  font-size: 14px;
`

export const AddressesList = styled.div`
  width: calc(100% - 16px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 0 10px;
  flex: 1 1 auto;
  overflow-y: scroll;
`

export const AddressAddButton = styled(AppButton)`
  font-size: 14px;
  flex-shrink: 0;
`

export const ConfirmButton = styled(AppButton)`
  width: 100%;
  flex-shrink: 0;
`

export const TrashWrp = styled.div`
  padding: 8px;
  cursor: pointer;
`

export const TrashIcon = styled(Icon)`
  color: ${theme.brandColors.secondary};
`

export const AddressPlaceholder = styled.span`
  color: #788ab4;
`

export const AddressValue = styled.span`
  color: ${theme.textColors.primary};
`
