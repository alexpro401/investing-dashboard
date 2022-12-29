import * as S from "./styled"
import { MutableRefObject, useRef } from "react"
import { createPortal } from "react-dom"
import { Flex } from "theme"

import { useAlertContext, AlertType } from "context/AlertContext"

import { ICON_NAMES } from "constants/icon-names"
import { AppButton, Overlay } from "common"
import { useBreakpoints } from "hooks"

const alertRoot = document.getElementById("alert")

const iconMapper = {
  [AlertType.info]: <S.AlertContentIcon name={ICON_NAMES.infoCircled} />,
  [AlertType.warning]: <S.AlertContentIcon name={ICON_NAMES.warningCircled} />,
}

const Alert: React.FC = () => {
  const { isOpen, type, title, content, hideAlert } = useAlertContext()
  const contentRef = useRef() as MutableRefObject<HTMLDivElement>

  const { isMobile } = useBreakpoints()

  if (!alertRoot) return null
  return createPortal(
    <>
      {!isMobile && (
        <Overlay onClick={hideAlert} animate={isOpen ? "visible" : "hidden"} />
      )}
      <S.Container
        animate={isOpen ? "visible" : "hidden"}
        initial="hidden"
        variants={{
          visible: {
            opacity: 1,
            pointerEvents: "auto",
          },
          hidden: {
            opacity: 0,
            pointerEvents: "none",
          },
        }}
        transition={{ duration: 0.1 }}
        onClick={hideAlert}
      >
        <S.Body
          variants={{
            visible: {
              y: 0,
              opacity: 1,
            },
            hidden: {
              y: 20,
              opacity: 0,
            },
          }}
          transition={{ duration: 0.15 }}
          onClick={(e) => e.stopPropagation()}
        >
          <S.Header>
            <Flex m="0 8px 1px 0">{type && iconMapper[type]}</Flex>
            <S.Title>{title || "Action unavailable"}</S.Title>
            <S.AlertCloseIcon
              onClick={hideAlert}
              name={ICON_NAMES.modalClose}
            />
          </S.Header>
          <S.Content ref={contentRef}>{content}</S.Content>
          {!isMobile && (
            <AppButton
              full
              onClick={hideAlert}
              text={"Ok"}
              color={"secondary"}
            />
          )}
        </S.Body>
      </S.Container>
    </>,
    alertRoot
  )
}

export default Alert
