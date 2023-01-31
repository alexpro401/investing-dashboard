import React from "react"

import { useBreakpoints } from "hooks"
import {
  Card,
  CardDescription,
  CardHead,
  Headline1,
  Icon,
  RegularText,
} from "common"
import theme from "theme"

import * as S from "./styled"
import * as SForms from "common/FormSteps/styled"
import { ICON_NAMES } from "consts"

const BeforeYouStart: React.FC = () => {
  const { isMobile } = useBreakpoints()

  return (
    <>
      <SForms.StepsRoot>
        {!isMobile && (
          <S.DesktopHeaderWrp>
            <Headline1 color={theme.statusColors.info} desktopWeight={900}>
              Токен сейл
            </Headline1>
            <RegularText
              color={theme.textColors.secondary}
              desktopWeight={500}
              desktopSize={"14px"}
            >
              Объяснить как рабоатет токен сейл в Инвестменте.
            </RegularText>
            <br />
            <RegularText
              color={theme.textColors.secondary}
              desktopWeight={500}
              desktopSize={"14px"}
            >
              Продаем любые токены из трежери
            </RegularText>
            <br />
            <RegularText
              color={theme.textColors.secondary}
              desktopWeight={500}
              desktopSize={"14px"}
            >
              Настраиваем вестинг
            </RegularText>
            <br />
            <RegularText
              color={theme.textColors.secondary}
              desktopWeight={500}
              desktopSize={"14px"}
            >
              Продаем за любое количество токенов/выставляем любую цену
            </RegularText>
            <br />
            <RegularText
              color={theme.textColors.secondary}
              desktopWeight={500}
              desktopSize={"14px"}
            >
              сначала пропозал, после голосовния запуск токенсейла
            </RegularText>
          </S.DesktopHeaderWrp>
        )}
        {isMobile && (
          <Card>
            <CardHead
              title="Before you start"
              nodeLeft={<Icon name={ICON_NAMES.infoCircled} />}
            />
            <CardDescription>
              <p>Объяснить как рабоатет токен сейл в Инвестменте.</p>
              <br />
              <p>Продаем любые токены из трежери</p>
              <br />
              <p>Настраиваем вестинг</p>
              <br />
              <p>Продаем за любое количество токенов/выставляем любую цену</p>
              <br />
              <p>сначала пропозал, после голосовния запуск токенсейла</p>
            </CardDescription>
          </Card>
        )}
      </SForms.StepsRoot>
      <SForms.FormStepsNavigationWrp nextLabel="Start" />
    </>
  )
}

export { BeforeYouStart }
