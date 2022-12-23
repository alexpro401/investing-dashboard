import styled from "styled-components/macro"

export const Root = styled.div`
  position: relative;
`

export const InternalInputWrp = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.textColors.secondary};
  gap: 4px;
`

export const InternalInput = styled.input`
  background: transparent;
  border: none;
  flex: 1;
  max-width: 80px;
  text-align: right;

  color: ${(props) => props.theme.textColors.primary} !important;
  -webkit-text-fill-color: ${(props) =>
    props.theme.textColors.primary} !important;
  fill: ${(props) => props.theme.textColors.primary} !important;

  &:focus {
    outline: none;
  }
`

export const OverlapLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const OverlapCroppedAddress = styled.span`
  color: ${(props) => props.theme.textColors.primary};
`

export const InternalInputPlaceholder = styled.button`
  color: ${(props) => props.theme.brandColors.secondary};
  font-weight: 600;
  padding: 0;
  background: transparent;
  border: none;
`
