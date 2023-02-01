import { useKey } from "react-use"
import { FC, ReactNode } from "react"
import { ICON_NAMES } from "consts/icon-names"
import { Icon, Overlay } from "common"
import { createPortal } from "react-dom"
import * as S from "./styled"

const modalRoot = document.getElementById("modal")

interface Props {
  isOpen: boolean
  title: string | ReactNode
  children?: ReactNode
  maxWidth?: string
  isShowCloseBtn?: boolean
  onClose: () => void
}

const Modal: FC<Props> = ({
  children,
  isOpen,
  onClose,
  title,
  maxWidth,
  isShowCloseBtn = true,
}) => {
  useKey("Escape", () => onClose())

  if (!modalRoot) return null

  return createPortal(
    <>
      <Overlay onClick={onClose} animate={isOpen ? "visible" : "hidden"} />
      <S.Container
        maxWidth={maxWidth}
        animate={isOpen ? "visible" : "hidden"}
        initial="hidden"
        transition={{ duration: 0.1 }}
        variants={{
          visible: {
            opacity: 1,
            display: "block",
          },
          hidden: {
            opacity: 0,
            transitionEnd: { display: "none" },
          },
        }}
      >
        {isShowCloseBtn || title ? (
          <S.Head>
            {title ? (
              typeof title === "string" ? (
                <S.Title>{title}</S.Title>
              ) : (
                title
              )
            ) : (
              <> </>
            )}
            {isShowCloseBtn ? (
              <Icon name={ICON_NAMES.modalClose} onClick={onClose} />
            ) : (
              <></>
            )}
          </S.Head>
        ) : (
          <></>
        )}
        {children}
      </S.Container>
    </>,
    modalRoot
  )
}

export default Modal
