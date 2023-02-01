import { FC, HTMLAttributes, useContext, useMemo, useState } from "react"
import { PoolProfileContext } from "pages/PoolProfile/context"
import {
  Card,
  CardDescription,
  CardFormControl,
  CardHead,
  Collapse,
  Icon,
} from "common"
import { ICON_NAMES } from "consts"
import Switch from "components/Switch"
import { InputField } from "fields"

import * as S from "./styled"
import { useDispatch } from "react-redux"
import { useEffectOnce } from "react-use"
import { hideTapBar, showTabBar } from "state/application/actions"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const FundDetailsInvestment: FC<Props> = () => {
  const { basicToken, fundTicker } = useContext(PoolProfileContext)

  const [isMinInvestAmountActive, setIsMinInvestmentAmountActive] =
    useState(false)

  const [isLimitedEmissionActive, setIsLimitedEmissionActive] = useState(false)

  const MinInvestmentCollapse = useMemo(
    () => (
      <Collapse isOpen={isMinInvestAmountActive}>
        <CardFormControl>
          <InputField
            value={""}
            nodeRight={
              <S.InputNodeRightElement>
                {basicToken?.symbol}
              </S.InputNodeRightElement>
            }
          />
        </CardFormControl>
      </Collapse>
    ),
    [basicToken, isMinInvestAmountActive]
  )

  const LimitedEmissionCollapse = useMemo(
    () => (
      <Collapse isOpen={isLimitedEmissionActive}>
        <CardFormControl>
          <InputField
            value={""}
            nodeRight={
              <S.InputNodeRightElement>{fundTicker}</S.InputNodeRightElement>
            }
          />
        </CardFormControl>
      </Collapse>
    ),
    [fundTicker, isLimitedEmissionActive]
  )

  const dispatch = useDispatch()

  useEffectOnce(() => {
    dispatch(hideTapBar())

    return () => {
      dispatch(showTabBar())
    }
  })

  return (
    <>
      <Card>
        <CardHead
          nodeLeft={<Icon name={ICON_NAMES.dollarOutline} />}
          title="Min Investment Amount"
          nodeRight={
            <Switch
              isOn={isMinInvestAmountActive}
              onChange={(n, v) => {
                setIsMinInvestmentAmountActive(v)
              }}
              name={"is-min-invest-amount-active"}
            />
          }
        />
        <CardDescription>
          <p>
            Вы можете ограничить минимальную инвестицию в ваш фонд. Это можно
            менять в любой момент
          </p>
        </CardDescription>
        {MinInvestmentCollapse}
      </Card>
      <Card>
        <CardHead
          nodeLeft={<Icon name={ICON_NAMES.dollarOutline} />}
          title="Limited Emission"
          nodeRight={
            <Switch
              isOn={isLimitedEmissionActive}
              onChange={(n, v) => {
                setIsLimitedEmissionActive(v)
              }}
              name={"is-limited-emission-active"}
            />
          }
        />
        <CardDescription>
          <p>
            Вы можете настроить эмиссию вашего фонда. Это можно менять в любой
            момент
          </p>
        </CardDescription>
        {LimitedEmissionCollapse}
      </Card>
      <S.FormSubmitBtn text="Confirm changes" />
    </>
  )
}

export default FundDetailsInvestment
