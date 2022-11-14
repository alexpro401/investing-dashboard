import { Icon } from "common"
import { ICON_NAMES } from "constants/icon-names"
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
}

const Modal: FC<Props> = ({ children, isOpen, toggle, title, maxWidth }) => {
  if (!modalRoot) return null
  return createPortal(
    <>
      <S.Overlay
        onClick={toggle}
        animate={isOpen ? "visible" : "hidden"}
        initial="hidden"
        transition={{ duration: 0.05 }}
        variants={{
          visible: {
            opacity: 0.4,
            display: "block",
          },
          hidden: {
            opacity: 0,
            transitionEnd: { display: "none" },
          },
        }}
      />
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
        <S.Head>
          <S.Title>{title}</S.Title>
          <Icon name={ICON_NAMES.modalClose} onClick={toggle} />
        </S.Head>
        {children}
      </S.Container>
    </>,
    modalRoot
  )
}

export default Modal
