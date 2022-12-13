import styled from "styled-components"
import { Icon } from "common"

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  text-align: center;
  color: ${(props) => props.theme.textColors.secondary};
  font-size: 24px;
  padding: 8px;
`

export const NoDataIcon = styled(Icon)`
  color: inherit;
  width: 200px;
  height: 120px;
`

export const NoDataTitle = styled.span`
  font-weight: 500;
  font-size: 13px;
  line-height: 1.5;
  color: inherit;
`
