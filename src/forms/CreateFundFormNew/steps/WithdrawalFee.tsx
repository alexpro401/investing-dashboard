import React, { useCallback, useContext } from "react"

import { Headline1, RegularText } from "common"
import { useBreakpoints } from "hooks"
import theme, { Flex } from "theme"
import { stepsControllerContext } from "context/StepsControllerContext"
import { CreateFundContext, IFeeType } from "context/fund/CreateFundContext"

import * as S from "./styled"
import * as SForms from "common/FormSteps/styled"
import CreateFundDocsImage from "assets/others/create-fund-docs.png"

const sliderLimitsByPeriodType = {
  "1 month": {
    min: 20,
    max: 30,
  },
  "3 month": {
    min: 20,
    max: 50,
  },
  "12 month": {
    min: 20,
    max: 80,
  },
}

const WithdrawalFee: React.FC = () => {
  const { isMobile, isDesktop } = useBreakpoints()

  const { nextCb } = useContext(stepsControllerContext)
  const { feeType, comission } = useContext(CreateFundContext)

  const handleNextStep = useCallback(() => {
    nextCb()
  }, [nextCb])

  return (
    <SForms.StepsRoot>
      {!isMobile && (
        <S.DesktopHeaderWrp>
          <Headline1 color={theme.statusColors.info} desktopWeight={900}>
            Withdrawal fee*
          </Headline1>
          <RegularText
            color={theme.textColors.secondary}
            desktopWeight={500}
            desktopSize={"14px"}
          >
            Выберите период через который вы сможете забирать заработанную
            комиссию. Чем больше период вы выберете - тем больше комиссию
            сможете получать.
          </RegularText>
          <br />
          <RegularText
            color={theme.textColors.secondary}
            desktopWeight={500}
            desktopSize={"14px"}
          >
            Период начинанает отсчет с момента создания пула. Если вы не сняли
            комиссию через указанный период вы сможете снять ее в любое время
            после, это также никак не повлияет на счет следующего периода
            поскольку они считаются подряд, в формате эпох.
          </RegularText>
          <br />
          <RegularText
            color={theme.textColors.secondary}
            desktopWeight={500}
            desktopSize={"14px"}
          >
            {`*Once created, this info can't be changed.`}
          </RegularText>
        </S.DesktopHeaderWrp>
      )}
      {isDesktop && (
        <Flex ai="stretch" jc="space-between" gap="16" full>
          <S.FeeCardWrp
            value={feeType.get}
            setValue={(v) => {
              feeType.set(v as IFeeType)
              comission.set(20)
            }}
            valueToSet={"1 month"}
            title="1 Months"
            description={
              <Flex full dir="column" ai="center" gap="16" p="16px 0">
                <img src={CreateFundDocsImage} alt="" />
                <p>Performance Fee limits of 20% to 30%</p>
                {feeType.get === "1 month" && (
                  <S.FeeSlider
                    limits={sliderLimitsByPeriodType["1 month"]}
                    initial={comission.get}
                    name="1 month comission"
                    onChange={(_, v) => comission.set(v)}
                  />
                )}
              </Flex>
            }
          />
          <S.FeeCardWrp
            value={feeType.get}
            setValue={(v) => {
              feeType.set(v as IFeeType)
              comission.set(20)
            }}
            valueToSet={"3 month"}
            title="3 Months"
            description={
              <Flex full dir="column" ai="center" gap="16" p="16px">
                <img src={CreateFundDocsImage} alt="" />
                <p>Performance Fee limits of 20% to 50%</p>
                {feeType.get === "3 month" && (
                  <S.FeeSlider
                    limits={sliderLimitsByPeriodType["3 month"]}
                    initial={comission.get}
                    name="3 month comission"
                    onChange={(_, v) => comission.set(v)}
                  />
                )}
              </Flex>
            }
          />
          <S.FeeCardWrp
            value={feeType.get}
            setValue={(v) => {
              feeType.set(v as IFeeType)
              comission.set(20)
            }}
            valueToSet={"12 month"}
            title="12 Months"
            description={
              <Flex full dir="column" ai="center" gap="16" p="16px">
                <img src={CreateFundDocsImage} alt="" />
                <p>Performance Fee limits of 20% to 80%</p>
                {feeType.get === "12 month" && (
                  <S.FeeSlider
                    limits={sliderLimitsByPeriodType["12 month"]}
                    initial={comission.get}
                    name="12 month comission"
                    onChange={(_, v) => comission.set(v)}
                  />
                )}
              </Flex>
            }
          />
        </Flex>
      )}
      <SForms.FormStepsNavigationWrp
        customNextCb={handleNextStep}
        nextLabel={"Create fund"}
      />
    </SForms.StepsRoot>
  )
}

export default WithdrawalFee
