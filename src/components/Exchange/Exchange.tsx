import { FC, useCallback, useState } from "react"

import CircularProgress from "components/CircularProgress"
import IconButton from "components/IconButton"
import TransactionSlippage from "components/TransactionSlippage"
import InfoAccordion, { Info } from "components/InfoAccordion"

import settings from "assets/icons/settings.svg"

import * as S from "./styled"
import { Icon } from "common"
import { ICON_NAMES } from "consts"
import { useRouteState } from "hooks"

interface Props {
  title: string
  children?: React.ReactNode
  form: React.ReactNode
  buttons: React.ReactNode[]
  info?: Info[]
  slippage?: string
  setSlippage?: (v: string) => void
  withClose?: boolean
}

const Exchange: FC<Props> = ({
  title,
  children,
  form,
  buttons,
  info,
  slippage,
  setSlippage,
  withClose = true,
}) => {
  const [isSlippageOpen, setSlippageOpen] = useState(false)
  const state = useRouteState()

  const withSlippage = !!slippage && !!setSlippage

  const handleClose = useCallback(() => {
    console.log(state)
  }, [state])

  return (
    <S.Card>
      <S.CardHeader>
        <S.Title active>{title}</S.Title>
        <S.IconsGroup>
          <CircularProgress />
          {withSlippage && (
            <IconButton
              size={12}
              media={settings}
              onClick={() => setSlippageOpen(!isSlippageOpen)}
            />
          )}
          {withClose && (
            <Icon name={ICON_NAMES.modalClose} onClick={handleClose} />
          )}
        </S.IconsGroup>
      </S.CardHeader>

      <S.CardForm>{form}</S.CardForm>

      {children}

      {buttons.map((b) => b)}

      {info && <S.ButtonDivider />}

      {info && <InfoAccordion rows={info} />}

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
