import styled from "styled-components"

import { Icon, StepsNavigation, Card, AppButton } from "common"
import StepsControllerContext from "context/StepsControllerContext"
import { motion } from "framer-motion"
import { opacityVariants } from "motion/variants"
import {
  getDefaultFieldBorderStyles,
  getDefaultFieldErrorStyles,
} from "fields/styled"
import ExternalLink from "components/ExternalLink"
import { ICON_NAMES } from "../../constants/icon-names"

export const Container = styled(StepsControllerContext)`
  display: flex;
  margin: 0 auto;
  background-color: #040a0f;
  width: 100%;
  height: calc(100vh - 94px);
  overflow-y: auto;

  @media all and (display-mode: standalone) {
    height: calc(100vh - 115px);
  }
`

export const StepsContainer = styled(motion.div).attrs(() => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
  variants: opacityVariants,
}))`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const CreateDaoCardNumberIcon = styled.div`
  position: relative;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid #7fffd4;
`

export const CreateDaoCardNumberIconText = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #7fffd4;
  font-size: 12px;
  line-height: 1.2;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
`

export const CreateFundDaoAvatarActions = styled.div`
  display: flex;
  flex-direction: column;
`

export const CreateFundDaoAvatarBtn = styled.button`
  background: none;
  color: #2669eb;
  font-size: 13px;
  line-height: 1.2;
  font-weight: 600;
  border: none;
  margin-top: 8px;
`

export const CreateFundDaoAvatarBtnErrorMessage = styled.span`
  ${getDefaultFieldErrorStyles};
`

export const CenteredImage = styled.img`
  margin: 0 auto;
`

export const StepsRoot = styled.div`
  display: flex;
  flex-direction: column;
  transform: scale(1);
  gap: 16px;
  padding: 14px 16px 20px;
  flex: 1;
`

export const StepsBottomNavigation = styled(StepsNavigation)`
  margin-top: auto;
`

export const OverflowedCard = styled(Card)`
  overflow: hidden;
  height: 100%;
`

export const FieldValidIcon = styled(Icon)`
  color: ${(props) => props.theme.statusColors.success};
`

export const CardAddBtn = styled(AppButton)`
  margin: 0 auto;
`

export const CardFieldBtn = styled(AppButton)`
  text-align: left;
  justify-content: flex-start;
  width: 100%;

  ${getDefaultFieldBorderStyles}

  padding: 17.5px 16px;

  &:not([disabled]):hover,
  &:not([disabled]):focus {
    ${getDefaultFieldBorderStyles}
  }
`

export const SuccessBackdrop = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 200px;
  height: 100%;
  box-shadow: 0px -3px 102px 2px rgba(149, 185, 255, 0.26);
  border-radius: 26px 26px 0px 0px;
  background: #08121a;
`

export const SuccessAvatarWrp = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  margin: -50px 0 16px;
  background: transparent;

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
  max-width: 90%;
  white-space: nowrap;
  color: ${(props) => props.theme.textColors.primary};
  margin: 0;
  font-size: 20px;
  fonwt-weight: 600;
`

export const SuccessSubtitle = styled(ExternalLink)`
  color: #788ab4;
  font-size: 16px;
`

export const SuccessDescription = styled.div`
  text-align: center;
  color: ${(props) => props.theme.textColors.primary};
  margin: auto 0;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 500;
`

export const SuccessFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 24px 16px;
  border-top: 1px solid #293c54;
  width: 100%;
`

export const SuccessLinkBtn = styled(AppButton)`
  width: 100%;
`

export const SuccessLinksWrp = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
`

export const SuccessLink = styled(AppButton)`
  color: #788ab4;
`

export const InfoPopupActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`

export const InfoPopupIcon = styled(Icon)`
  color: ${(props) => props.theme.textColors.secondary};
  width: 24px;
  height: 24px;
`

export const InfoPopupHeaderTitle = styled.h3`
  color: ${(props) => props.theme.textColors.primary};
  font-weight: 700;
  font-size: 15px;
  line-height: 1.3;
  margin: 0;
`

export const InfoPopupCloseBtn = styled(AppButton).attrs(() => ({
  color: "default",
  iconRight: ICON_NAMES.close,
  size: "no-paddings",
}))`
  color: ${(props) => props.theme.textColors.secondary};
  margin-left: auto;
`

export const InfoPopupContent = styled.div`
  max-width: 350px;
`

export const InfoPopupContentText = styled.div`
  font-weight: 500;
  font-size: 13px;
  line-height: 1.5;
  color: ${(props) => props.theme.textColors.primary};
  margin-bottom: 16px;
`

export const InfoPopupContentTitle = styled.h5`
  font-size: 13px;
  line-height: 1.5;
  font-weight: 700;
  color: ${(props) => props.theme.brandColors.secondary};
  margin: 0 0 6px;
`
