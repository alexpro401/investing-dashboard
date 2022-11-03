import styled from "styled-components"
import theme from "theme"

export const Root = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const Record = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
`

export const Label = styled.span`
  font-family: "Gilroy";
  color: ${theme.textColors.secondary};
  font-size: 13px;
  font-weight: 500;
`

export const Value = styled.span`
  font-family: "Gilroy";
  color: ${theme.textColors.primary};
  font-size: 13px;
  font-weight: 500;
  text-align: right;
`
