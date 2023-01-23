import styled from "styled-components/macro"

export const FieldContainer = styled.div`
  position: relative;
`

export const NodeLeftBtn = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
  line-height: 1.2;
  font-weight: 500;
  color: ${(props) => props.theme.brandColors.secondary};
`

export const BalanceInputWrp = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-columns: clamp(50px, 25%, 100px) max-content;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`

export const BalanceInput = styled.input`
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

export const BalanceTokenSymbol = styled.span`
  display: block;
  font-size: 16px;
  line-height: 1.2;
  font-weight: 500;
  color: ${(props) => props.theme.textColors.secondary};
`
