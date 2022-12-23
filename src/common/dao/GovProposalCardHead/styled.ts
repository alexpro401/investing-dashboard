import styled from "styled-components/macro"
import { Icon } from "common"
import { NavLink } from "react-router-dom"

export const Container = styled(NavLink)`
  border-bottom: 1px solid #293c54;
  margin-bottom: 16px;
  text-decoration: none;
`

export const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 16px;
  color: ${(props) => props.theme.textColors.primary};
  text-decoration: none;
`

export const TitleWrapper = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80%;
`

export const Title = styled.span`
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  white-space: nowrap;
`

export const HeadIcon = styled(Icon)`
  color: #788ab4;
  width: 8px;
`
