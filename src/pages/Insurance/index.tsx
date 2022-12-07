import { createClient, Provider as GraphProvider } from "urql"

import useInsurancePage from "./useInsurancePage"

import { Flex, Text } from "theme"
import Header from "components/Header/Layout"
import { Card, CardDescription, CardHead, DaoProposalsList } from "common"

import Management from "pages/Management"

import * as S from "./styled"

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
})

const Insurance = () => {
  const [{ checkingInvestmentStatus }, { onInsuranceCreateNavigate }] =
    useInsurancePage()

  const daoPool = String(
    process.env.REACT_APP_DEXE_DAO_ADDRESS
  ).toLocaleLowerCase()

  return (
    <>
      <Header>Insurance</Header>
      <S.Container>
        <S.Content>
          <S.Indents top side>
            <Card>
              <CardHead title="Headers" />
              <CardDescription>
                <p>
                  Текст защити свои инвестиции. чтобы создавать пропозалы вам
                  необходимо иметь страховку минимум 100 дикси
                </p>
              </CardDescription>
              <S.AppButtonFull
                type="button"
                size="small"
                color="secondary"
                onClick={onInsuranceCreateNavigate}
                text="Создать новый пропозал"
                disabled={checkingInvestmentStatus}
              />
            </Card>
          </S.Indents>
          <S.Indents top side>
            <Management />
          </S.Indents>
          <S.Indents top side={false}>
            <Flex full ai="center" jc="space-between" p={"0 16px"}>
              <Text fz={16} fw={600} color="#E4F2FF">
                Текущие пропозалы
              </Text>
              <S.InsuranceAllProposalsLink
                text="View all"
                routePath={`/dao/${daoPool}/proposals/opened`}
              />
            </Flex>
            <S.InsuranceProposalsList>
              <DaoProposalsList
                govPoolAddress={process.env.REACT_APP_DEXE_DAO_ADDRESS}
                status={"opened"}
              />
            </S.InsuranceProposalsList>
          </S.Indents>
        </S.Content>
      </S.Container>
    </>
  )
}

const InsuranceWithProvider = (props) => {
  return (
    <GraphProvider value={poolsClient}>
      <Insurance {...props} />
    </GraphProvider>
  )
}

export default InsuranceWithProvider
