import { createClient, Provider as GraphProvider } from "urql"

import useInsurancePage from "./useInsurancePage"
import { ICON_NAMES } from "constants/icon-names"

import { Flex, Text } from "theme"
import Header from "components/Header/Layout"
import { AppButton, Card, CardDescription, CardHead } from "common"

import Management from "pages/Management"

import * as S from "./styled"
import InsuranceProposals from "./InsuranceProposals"

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
          <Card>
            <CardHead title="Headers" />
            <CardDescription>
              <p>
                Текст защити свои инвестиции. чтобы создавать пропозалы вам
                необходимо иметь страховку минимум 100 дикси
              </p>
            </CardDescription>
            <S.InsuranceCreateButton
              type="button"
              size="small"
              color="secondary"
              onClick={onInsuranceCreateNavigate}
              text="Создать новый пропозал"
              disabled={checkingInvestmentStatus}
            />
          </Card>
          <Flex m="16px 0 0" full>
            <Management />
          </Flex>
          <Flex m="40px 0 0" full dir="column">
            <Flex full ai="center" jc="space-between">
              <Text fz={16} fw={600} color="#E4F2FF">
                Текущие пропозалы
              </Text>
              <AppButton
                color="default"
                text="View all"
                size="x-small"
                iconRight={ICON_NAMES.angleRightOutlined}
                routePath={`/dao/${daoPool}/proposals/opened`}
              />
            </Flex>
            <InsuranceProposals />
          </Flex>
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
