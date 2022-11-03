import styled from "styled-components"

export const Root = styled.div`
  overflow: hidden auto;
  flex: 1;
  height: calc(100vh - 94px);
  @media all and (display-mode: standalone) {
    height: calc(100vh - 115px);
  }
`

export const DaoProposalsListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${(props) => props.theme.textColors.secondary};
  padding: 16px;
  border-bottom: 1px solid #293c54;
`

export const DaoProposalsListTab = styled.button.attrs(() => ({
  type: "button",
}))<{ isActive: boolean }>`
  background: transparent;
  border: none;
  color: ${(props) =>
    props.isActive
      ? props.theme.textColors.primary
      : props.theme.textColors.secondary};
`

export const DaoProposalsListBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
`
