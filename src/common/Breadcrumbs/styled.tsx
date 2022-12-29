import styled from "styled-components/macro"
import { NavLink } from "react-router-dom"

export const Root = styled.div``

export const BreadcrumbItem = styled(NavLink)`
  text-decoration: none;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  /* identical to box height */

  letter-spacing: 0.01em;

  /* Text/2 */

  color: #b1c7fc;

  &:last-child {
    pointer-events: none;
    color: #e4f2ff;
  }
`
