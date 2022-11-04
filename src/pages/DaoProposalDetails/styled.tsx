import styled, { css } from "styled-components"

export const DaoProposalDetails = styled.div`
  overflow: hidden auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: ${(props) => props.theme.textColors.primary};
  padding: 16px;
  flex: 1;
  height: calc(100vh - 94px);
  @media all and (display-mode: standalone) {
    height: calc(100vh - 115px);
  }
`

export const DaoProposalDetailsTitleWrp = styled.div``

export const DaoProposalDetailsTitle = styled.div``

export const DaoProposalDetailsProgressBar = styled.div`
  overflow: hidden;
  background: #131927;
  border-radius: 6px;
  min-height: 3px;
  height: 3px;
  width: 100%;

  &:after {
    content: "";
    display: block;
    height: 100%;
    width: 50%;
    background: ${(props) => props.theme.statusColors.success};
  }
`

export const DaoProposalDetailsTabs = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: rgba(32, 41, 58, 0.5);
  }
`

export const DaoProposalDetailsTabsItem = styled.button.attrs(() => ({
  type: "button",
}))<{ isActive: boolean }>`
  position: relative;
  font-weight: 500;
  font-size: 13px;
  line-height: 15px;
  text-align: center;
  padding-bottom: 12px;
  background: transparent;
  border: none;
  color: ${(props) =>
    props.isActive
      ? props.theme.statusColors.success
      : props.theme.textColors.secondary};

  ${(props) =>
    props.isActive
      ? css`
          &:after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background: ${(props) => props.theme.statusColors.success};
            z-index: 1;
          }
        `
      : ""}
`

export const DaoProposalDetailsCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #181e2c;
  border-radius: 20px;
  padding: 16px;
`

export const DaoProposalDetailsCardTitle = styled.span`
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  color: ${(props) => props.theme.textColors.primary};
  margin-bottom: 12px;
`

export const DaoProposalDetailsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`

export const DaoProposalDetailsRowText = styled.span<{
  textType:
    | "label"
    | "value"
    | "complex"
    | "success"
    | "error"
    | "warning"
    | "info"
}>`
  font-weight: 500;
  font-size: 13px;
  line-height: 150%;

  ${(props) => {
    if (props.textType === "complex") {
      return css`
        display: flex;
        flex-direction: column;
        gap: 4px;

        span {
          color: ${(props) => props.theme.textColors.secondary};
        }

        p {
          color: ${(props) => props.theme.textColors.primary};
        }
      `
    } else if (props.textType === "label") {
      return css`
        color: ${(props) => props.theme.textColors.secondary};
      `
    } else if (props.textType === "value") {
      return css`
        color: ${(props) => props.theme.textColors.primary};
      `
    } else if (props.textType === "success") {
      return css`
        color: ${(props) => props.theme.statusColors.success};
      `
    } else if (props.textType === "error") {
      return css`
        color: ${(props) => props.theme.statusColors.error};
      `
    } else if (props.textType === "warning") {
      return css`
        color: ${(props) => props.theme.statusColors.warning};
      `
    } else if (props.textType === "info") {
      return css`
        color: ${(props) => props.theme.statusColors.info};
      `
    } else {
      return ""
    }
  }}
`

export const DaoProposalCardRowDivider = styled.div`
  background: rgba(32, 41, 58, 0.6);
  opacity: 0.5;
  width: 100%;
  height: 1px;
`
