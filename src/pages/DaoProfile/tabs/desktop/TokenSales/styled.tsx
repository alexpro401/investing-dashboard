import styled from "styled-components/macro"
import { NavLink } from "react-router-dom"

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap);
`

export const TutorialBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 46px 128px;
  width: 100%;
  margin: 64px 0 0;
  min-height: 135px;
  background: linear-gradient(180deg, #0c1018 0%, #0c1018 100%);
  border-radius: 20px;
`

export const TutorialTitle = styled.h2`
  font-style: normal;
  font-size: 36px;
  line-height: 1.2;
  font-weight: 400;
  letter-spacing: -0.02em;
  color: #ffffff;
  margin: 0;
`

export const TutorialBtn = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.brandColors.secondary};
`

export const SectionTitle = styled.h2`
  color: ${(props) => props.theme.textColors.primary};
  font-size: 20px;
  line-height: 1.2;
  font-weight: 700;
`

export const TitleLink = styled(NavLink)`
  text-decoration: none;
  color: #368bc9;
`
