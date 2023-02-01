import { FC, useState, useMemo, useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { AnimatePresence } from "framer-motion"

import Header from "components/Header/Layout"
import TutorialCard from "components/TutorialCard"
import { SelectableCard, Headline1, RegularText } from "common"

import { useBreakpoints } from "hooks"
import theme from "theme"
import { hideTapBar, showTabBar } from "state/application/actions"

import CreateFundDocsImage from "assets/others/create-fund-docs.png"
import RadioButton from "components/RadioButton"

import * as S from "./styled"
import * as SForms from "common/FormSteps/styled"

enum FUND_TYPES {
  basic = "basic",
  investment = "investment",
}

enum STEPS {
  chooseTypeOfFund = "chooseTypeOfFund",
  basicFundSettings = "basicFundSettings",
  additionalSettings = "additionalSettings",
  comission = "comission",
}

const STEPS_TITLES: Record<STEPS, string> = {
  [STEPS.chooseTypeOfFund]: "Choose type of fund",
  [STEPS.basicFundSettings]: "Basic fund settings",
  [STEPS.additionalSettings]: "Additional settings",
  [STEPS.comission]: "Comission",
}

const CreateFund: FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [fundType, setFundType] = useState(FUND_TYPES.basic)
  const { isMobile } = useBreakpoints()

  useEffect(() => {
    dispatch(hideTapBar())

    return () => {
      dispatch(showTabBar())
    }
  }, [dispatch])

  const totalStepsCount = useMemo(() => Object.values(STEPS).length, [])

  const proceedToCreate = useCallback(() => {
    const targetRoute =
      fundType === FUND_TYPES.basic
        ? "/create-fund/basic"
        : fundType === FUND_TYPES.investment
        ? "/create-fund/investment"
        : "/"

    navigate(targetRoute)
  }, [fundType, navigate])

  const prevCb = useCallback(() => {
    navigate("/me/trader")
  }, [navigate])

  return (
    <>
      <Header>Create Fund</Header>
      <S.Root isWithPaddings={true}>
        <S.PageHolder>
          <SForms.StepsFormContainer
            currentStepNumber={1}
            totalStepsAmount={totalStepsCount}
            prevCb={prevCb}
            nextCb={proceedToCreate}
          >
            <AnimatePresence>
              <SForms.StepsWrapper>
                <SForms.StepsContainer>
                  <SForms.StepsRoot>
                    <TutorialCard
                      imageSrc={CreateFundDocsImage}
                      linkText={" Read the documentation"}
                      text={
                        " See the documentation of various pools and key details."
                      }
                      href={"https://123.com"}
                    />

                    {isMobile && (
                      <S.FundTypeCards>
                        <S.FundTypeCardsTitle>
                          Create your own fund
                        </S.FundTypeCardsTitle>
                        <SelectableCard
                          value={fundType}
                          setValue={setFundType}
                          valueToSet={FUND_TYPES.basic}
                          nodeLeft={
                            <RadioButton
                              selected={fundType}
                              value={FUND_TYPES.basic}
                              onChange={() => {}}
                            />
                          }
                          title="Standard fund"
                          description={
                            <p>
                              Trade crypto from the Dexe DAO white list + any
                              other crypto via a Risk Proposal
                            </p>
                          }
                        />
                        <SelectableCard
                          value={fundType}
                          setValue={setFundType}
                          valueToSet={FUND_TYPES.investment}
                          nodeLeft={
                            <RadioButton
                              selected={fundType}
                              value={FUND_TYPES.investment}
                              onChange={() => {}}
                            />
                          }
                          title="Investment fund"
                          description={
                            <p>
                              Investment in NFTs, Real Estate, Startups, and any
                              other assets you want.
                            </p>
                          }
                        />
                      </S.FundTypeCards>
                    )}
                    {!isMobile && (
                      <>
                        <S.DesktopHeaderWrp>
                          <Headline1
                            color={theme.statusColors.info}
                            desktopWeight={900}
                          >
                            Create your own fund:
                          </Headline1>
                          <RegularText
                            color={theme.textColors.secondary}
                            desktopWeight={500}
                            desktopSize={"14px"}
                          >
                            Прежде всего определитесь и выберите тип фонда
                            который хотите создать. Подробнее о каждом из типов
                            фонда вы можете прочитать в документации по ссылке
                            выше.
                          </RegularText>
                          <br />
                          <RegularText
                            color={theme.textColors.secondary}
                            desktopWeight={500}
                            desktopSize={"14px"}
                          >
                            Заполняйте всю информацию максимально понятно,
                            изучая эту информацию инвестора будут принимать
                            инвестиционные решения в отношении вашего фонда.
                          </RegularText>
                        </S.DesktopHeaderWrp>
                        <S.FundTypeCardsDesktop>
                          <S.CreateFundDaoFeaturesDesktop
                            value={fundType}
                            setValue={setFundType}
                            valueToSet={FUND_TYPES.basic}
                            nodeLeft={<img src={CreateFundDocsImage} alt="" />}
                            title="Standard fund"
                            description={
                              <p>
                                Trade crypto from the Dexe DAO white list + any
                                other crypto via a Risk Proposal
                              </p>
                            }
                          />
                          <S.CreateFundDaoFeaturesDesktop
                            value={fundType}
                            setValue={setFundType}
                            valueToSet={FUND_TYPES.investment}
                            title="Investment fund"
                            nodeLeft={<img src={CreateFundDocsImage} alt="" />}
                            description={
                              <p>
                                Investment in NFTs, Real Estate, Startups, and
                                any other assets you want.
                              </p>
                            }
                          />
                        </S.FundTypeCardsDesktop>
                      </>
                    )}
                    <SForms.FormStepsNavigationWrp nextLabel={"Create fund"} />
                  </SForms.StepsRoot>
                </SForms.StepsContainer>
                {!isMobile && (
                  <SForms.SideStepsNavigationBarWrp
                    title="Create fund"
                    steps={Object.values(STEPS).map((step) => ({
                      number: Object.values(STEPS).indexOf(step),
                      title: STEPS_TITLES[step],
                    }))}
                    currentStep={0}
                  />
                )}
              </SForms.StepsWrapper>
            </AnimatePresence>
          </SForms.StepsFormContainer>
        </S.PageHolder>
      </S.Root>
    </>
  )
}

export default CreateFund
