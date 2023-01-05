import { FC, useState } from "react"

import CircularProgress from "components/CircularProgress"
import IconButton from "components/IconButton"
import TransactionSlippage from "components/TransactionSlippage"

import settings from "assets/icons/settings.svg"
import close from "assets/icons/close-big.svg"

import * as S from "./styled"

interface Props {
  title: string
  children: React.ReactNode
  button: React.ReactNode
  slippage?: string
  setSlippage?: (v: string) => void
  onClose: () => void
}

const Exchange: FC<Props> = ({
  title,
  children,
  button,
  slippage,
  setSlippage,
  onClose,
}) => {
  const [isSlippageOpen, setSlippageOpen] = useState(false)

  const withSlippage = !!slippage && !!setSlippage

  return (
    <S.Card>
      <S.CardHeader>
        <S.Title active>{title}</S.Title>
        <S.IconsGroup>
          <CircularProgress />
          <IconButton
            size={12}
            filled
            media={settings}
            onClick={() => setSlippageOpen(!isSlippageOpen)}
          />
          <IconButton
            size={10}
            filled
            media={close}
            onClick={() => onClose()}
          />
        </S.IconsGroup>
      </S.CardHeader>

      {children}

      <S.ButtonDivider />

      {button}

      {withSlippage && (
        <TransactionSlippage
          slippage={slippage}
          onChange={setSlippage}
          isOpen={isSlippageOpen}
          toggle={(v) => setSlippageOpen(v)}
        />
      )}
    </S.Card>
  )
}

export default Exchange
