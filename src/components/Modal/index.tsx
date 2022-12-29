import { ICON_NAMES } from "consts/icon-names"
import { Icon, Overlay } from "common"
import { FC, ReactNode } from "react"
import { createPortal } from "react-dom"
import * as S from "./styled"

const modalRoot = document.getElementById("modal")

interface Props {
  isOpen: boolean
  toggle: () => void
  title: string
  children?: ReactNode
  maxWidth?: string
  isShowCloseBtn?: boolean
}

const Modal: FC<Props> = ({
  children,
  isOpen,
  toggle,
  title,
  maxWidth,
  isShowCloseBtn = true,
}) => {
  if (!modalRoot) return null
  return createPortal(
    <>
      <Overlay onClick={toggle} animate={isOpen ? "visible" : "hidden"} />
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
            {title ? <S.Title>{title}</S.Title> : <> </>}
            {isShowCloseBtn ? (
              <Icon name={ICON_NAMES.modalClose} onClick={toggle} />
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
