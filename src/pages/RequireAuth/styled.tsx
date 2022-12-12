import styled from "styled-components"
import { Outlet } from "react-router-dom"
import TapBar from "components/TapBar"
import { AppHeader } from "common"

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
`

export const AuthAppHeader = styled(AppHeader)``

export const AuthOutletWrp = styled.div`
  position: relative;
  overflow: hidden auto;
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const AuthOutlet = styled(Outlet)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

export const AuthTapBar = styled(TapBar)`
  margin-top: auto;
`
