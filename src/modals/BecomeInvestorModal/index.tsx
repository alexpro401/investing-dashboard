import { AppButton } from "common"
import * as React from "react"
import { createPortal } from "react-dom"
import { useTranslation } from "react-i18next"
import * as S from "./styled"

const modalRoot = document.getElementById("modal")

interface Props {
  isOpen: boolean
  symbol: string
  action: () => void
  positionCount: number
}

const BecomeInvestorModal: React.FC<Props> = ({
  isOpen,
  symbol,
  action,
  positionCount,
}) => {
  const { t } = useTranslation()
  if (!modalRoot) return null

  return createPortal(
    <>
      <S.Overlay
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
      <S.Root
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
        <S.Container>
          <S.Title>{t("become-investor-modal.title")}</S.Title>
          <S.Text>
            {t("become-investor-modal.description", {
              positionCount,
            })}
          </S.Text>
          <AppButton
            size="medium"
            color="primary"
            full
            onClick={action}
            text={t("become-investor-modal.action-invest", {
              currency: symbol,
            })}
          />
        </S.Container>
      </S.Root>
    </>,
    modalRoot
  )
}

export default BecomeInvestorModal
