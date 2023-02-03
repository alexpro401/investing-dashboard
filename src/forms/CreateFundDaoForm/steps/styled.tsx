import styled from "styled-components/macro"
import { motion } from "framer-motion"

import { Icon, Card, AppButton, CardFormControl } from "common"
import StepsControllerContext from "context/StepsControllerContext"
import { opacityVariants } from "motion/variants"
import { getDefaultFieldErrorStyles } from "fields/styled"
import { Input } from "fields/InputField/styled"
import { InputField } from "fields"
import ExternalLink from "components/ExternalLink"
import { respondTo } from "theme"
import FormStepsNavigation from "common/FormStepsNavigation"

export const Container = styled(StepsControllerContext)`
  display: flex;
  margin: 0 auto;
  background-color: #040a0f;
  width: 100%;
  overflow-y: auto;
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
  gap: var(--app-gap);
`

export const DesktopHeaderWrp = styled.div`
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  width: 100%;
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
  gap: var(--app-gap);
  flex: 1;

  ${respondTo("sm")} {
    gap: 32px;
  }
`

export const ConditionalParameters = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap);
`

export const FormStepsNavigationWrp = styled(FormStepsNavigation)``

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
  text-align: center;
  width: 100%;
`

export const SuccessBackdrop = styled.div`
  font-family: ${(props) => props.theme.appFontFamily}, sans-serif;
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: 200px;
  height: 100%;
  box-shadow: 0px -3px 102px 2px rgba(149, 185, 255, 0.26);
  border-radius: 26px 26px 0 0;
  background: #08121a;

  ${respondTo("sm")} {
    min-width: 420px;
    margin-top: 0;
    background: #181e2c;
    padding: var(--app-padding);
    border-radius: 20px;
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
  font-size: 16px;

  ${respondTo("sm")} {
    color: #2669eb;
    margin-bottom: 16px;
  }
`

export const SuccessDescription = styled.div`
  text-align: center;
  align-self: center;
  color: ${(props) => props.theme.textColors.primary};
  margin: auto 0;
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
  overflow: hidden;
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  border-radius: 20px;
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

export const InfoPopupContent = styled.div`
  max-width: 350px;
`

export const InfoPopupContentText = styled.div`
  font-weight: 500;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 16px;
`

export const InfoPopupContentTitle = styled.h5`
  font-size: 13px;
  line-height: 1.5;
  font-weight: 700;
  color: #2669eb;
  margin: 0 0 6px;
`

export const SettingsWrapper = styled(CardFormControl)`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 24px;
`

export const ValidatorTokenComboField = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 24px;

  ${respondTo("sm")} {
    flex-direction: row;
  }
`

export const ValidatorTokenLeft = styled(InputField)`
  ${respondTo("sm")} {
    width: 50%;

    ${Input} {
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
      border-right: none;
    }
  }
`

export const ValidatorTokenRight = styled(InputField)`
  ${respondTo("sm")} {
    width: 50%;

    ${Input} {
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
    }
  }
`

export const ERCArea = styled.div`
  width: 100%;
  padding: 16px;
  border-radius: 20px;
  background-color: #1a2133;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const ERCAreaDescription = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const ERCAreaHead = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  align-items: center;
`

export const ERCImgWrp = styled.img`
  width: 100px;
`
