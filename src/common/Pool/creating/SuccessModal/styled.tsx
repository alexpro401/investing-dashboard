import styled from "styled-components/macro"

import theme, { respondTo } from "theme"
import { AppButton, Icon } from "common"
import ExternalLink from "components/ExternalLink"

export const ModalTitle = styled.span`
  align-self: center;
  max-width: 90%;
  color: ${(props) => props.theme.textColors.primary};
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
`

export const SuccessBackdrop = styled.div`
  font-family: ${(props) => props.theme.appFontFamily}, sans-serif;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0px -3px 102px 2px rgba(149, 185, 255, 0.26);
  margin-top: 0;
  background: #181e2c;
  padding: 16px;
  border-radius: 20px;

  ${respondTo("sm")} {
    min-width: 420px;
  }
`

export const SuccessAvatarWrp = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background: transparent;
  margin-bottom: 16px;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 50%;
    border: 5px solid transparent;
    background: linear-gradient(103.1deg, #2680eb 42.18%, #7fffd4 83.08%)
      border-box;
    -webkit-mask: linear-gradient(103.1deg, #2680eb 42.18%, #7fffd4 83.08%)
        padding-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
  }

  ${respondTo("sm")} {
    margin-top: 0;
  }
`

export const SuccessAvatar = styled.img`
  object-fit: cover;
  object-position: center;
  width: 75%;
  height: 75%;
  border-radius: 50%;
  z-index: 1;
`

export const SuccessTitle = styled.h2`
  overflow: hidden;
  text-overflow: ellipsis;
  align-self: center;
  white-space: nowrap;
  max-width: 90%;
  color: ${(props) => props.theme.textColors.primary};
  margin: 0;
  font-size: 20px;
  font-weight: 600;
`

export const SuccessSubtitle = styled(ExternalLink)`
  align-self: center;
  color: #788ab4;
  font-weight: 700;
  font-size: 14px;
  color: #2669eb;

  ${respondTo("sm")} {
    margin-bottom: 16px;
  }
`

export const SuccessGreenIcon = styled(Icon)`
  color: ${theme.statusColors.success};
`

export const SuccessDescription = styled.div`
  text-align: center;
  align-self: center;

  p {
    color: ${(props) => props.theme.textColors.primary};
  }

  margin: auto 0;
  margin-top: 16px;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 500;

  ${respondTo("sm")} {
    font-size: 14px;
    line-height: 1.7;
    letter-spacing: 0.01em;
    margin-bottom: 40px;
  }
`

export const SuccessFooter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 24px 16px;
  padding-bottom: 10px !important;
  border-top: 1px solid #293c54;

  ${respondTo("sm")} {
    padding: 16px 16px 0;
    border: 0;
  }
`

export const SuccessLinkBtn = styled(AppButton)`
  width: 100%;
`

export const SuccessSubmitBtnWrp = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  place-items: center;
  width: calc(100% - 32px);
  border-radius: 20px;
  gap: 5px;
`

export const SuccessSubmitBtn = styled(AppButton)`
  width: 100%;
`

export const SuccessLinksWrp = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: 100%;

  ${respondTo("sm")} {
    color: #2669eb;
  }
`

export const SuccessLink = styled(AppButton)`
  color: #788ab4;

  ${respondTo("sm")} {
    color: #788ab480;
  }
`

export const SuccessCloseBtn = styled(AppButton)`
  width: 100%;
  background-color: transparent;

  &:hover {
    background-color: transparent !important;
  }
`
