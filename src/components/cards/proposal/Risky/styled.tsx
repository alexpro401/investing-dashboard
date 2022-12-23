import styled from "styled-components/macro"

export const Status = styled.div<{ active: boolean }>`
  padding: 5px 6px;
  border-radius: 36px;
  white-space: nowrap;
  border: 1px solid ${(props) => (props.active ? "#9ae2cb" : "#788AB4")};
  color: ${(props) => (props.active ? "#9ae2cb" : "#788AB4")};
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 11px;
  line-height: 13px;
`
export const Ticker = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 100%;
  color: #788ab4;
`

export const AddButton = styled.div`
  margin-left: 0.5px;
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 11px;
  line-height: 100%;
  color: #2680eb;
  white-space: nowrap;
  cursor: pointer;
`
