import { FC, ReactNode } from "react"
import { createPortal } from "react-dom"
import * as S from "./styled"
import { ICON_NAMES } from "constants/icon-names"
import { Icon } from "common"

const modalRoot = document.getElementById("modal")

interface Props {
  isOpen: boolean
  toggle: () => void
  title: string
  children?: ReactNode
}

const Modal: FC<Props> = ({ children, isOpen, toggle, title }) => {
  if (!modalRoot) return null
  return createPortal(
    <>
      <S.Overlay
        onClick={toggle}
        animate={isOpen ? "visible" : "hidden"}
        initial="hidden"
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
        animate={isOpen ? "visible" : "hidden"}
        initial="hidden"
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
