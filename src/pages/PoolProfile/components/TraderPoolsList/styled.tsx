import styled, { css } from "styled-components/macro"
import { NavLink } from "react-router-dom"

export const Root = styled.div`
  display: flex;
  align-items: center;
  gap: var(--app-gap);
`

export const TraderPoolsListBadge = styled.div`
  display: flex;
  align-items: center;
  background: #101520;
  border-radius: 13px;
  gap: 4px;
`

export const TraderPoolsListBadgeAccountWrp = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
`

export const TraderPoolsListBadgeAccountImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`

export const TraderPoolsListBadgeAccountAddress = styled.div`
  font-size: 14px;
  line-height: 1.2;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: #6781bd;
`

export const TraderPoolsListBadgePoolWrp = styled(NavLink)<{
  isActive: boolean
}>`
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  color: #6781bd;
  font-size: 14px;
  line-height: 1.2;
  font-weight: 500;
  opacity: 0.5;

  ${(props) =>
    props.isActive
      ? css`
          background: #20283a;
          border-radius: 12px;
          color: ${(props) => props.theme.brandColors.secondary};
          font-weight: 700;
          opacity: 1;
        `
      : ""}
`

export const TraderPoolsListBadgePoolImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`

export const TraderPoolsListBadgePoolTick = styled.div`
  text-transform: uppercase;
  letter-spacing: 0.01em;
`
