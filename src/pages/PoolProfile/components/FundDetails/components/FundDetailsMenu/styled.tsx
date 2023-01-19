import styled from "styled-components/macro"
import { Icon } from "common"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap);
  color: ${(props) => props.theme.textColors.primary};
  min-height: 100%;
`

export const FundAvatarWrp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--app-gap);
`

export const FundAvatarImg = styled.img`
  object-fit: cover;
  object-position: center;
  max-width: 110px;
  max-height: 110px;
  width: 100%;
  height: 100%;
  border-radius: 50%;
`

export const FundAvatarChangeBtn = styled.button`
  background: transparent;
  border: none;
  text-align: center;
  font-size: 14px;
  line-height: 1.2;
  font-weight: 600;
  color: ${(props) => props.theme.brandColors.secondary};
`

export const MenuWrp = styled.div`
  background: ${(props) => props.theme.backgroundColors.secondary};
  border-radius: 20px;
`

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px;
`

export const MenuItemIconLeft = styled(Icon)`
  width: 24px;
`

export const MenuItemIconRight = styled(Icon)`
  margin-left: auto;
  width: 24px;
`
