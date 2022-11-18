import styled from "styled-components"

export const Container = styled.div<{ align?: "left" | "right" }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ align = "left" }) =>
    align === "right" ? "flex-end" : "flex-start"};
  gap: 4px;
`

export const Label = styled.span`
  color: ${(props) => props.theme.textColors.secondary};
  font-weight: 400;
  font-size: 13px;
  line-height: 15px;
`

export const Value = styled.span`
  color: ${(props) => props.theme.textColors.primary};
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
`
