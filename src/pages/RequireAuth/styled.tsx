import styled from "styled-components"
import { Outlet } from "react-router-dom"
import { AppHeader, AppNavigation } from "common"

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`

export const AuthAppHeader = styled(AppHeader)``

export const AuthMainWrp = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  order: 1;
  flex: 1;

  @media (min-width: 768px) {
    order: 2;
  }
`

export const AuthMain = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden auto;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

export const AuthNavigation = styled(AppNavigation)`
  margin-top: auto;
  order: 2;

  @media (min-width: 768px) {
    display: flex;
    order: 1;
    height: 100%;
  }
`

export const AuthOutletWrp = styled.div`
  position: relative;
  overflow: hidden auto;
  display: flex;
  flex: 1;
  background: ${(props) => props.theme.backgroundColors.primary};
`

export const AuthOutlet = styled(Outlet)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`