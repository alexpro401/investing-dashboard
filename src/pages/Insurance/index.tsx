import { createClient, Provider as GraphProvider } from "urql"

import useInsurancePage from "./useInsurancePage"

import * as S from "./styled"
import { Flex, Text } from "theme"
import { useBreakpoints } from "hooks"
import { DaoProposalsList } from "common"
import Header from "components/Header/Layout"

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
})

const Insurance = () => {
  const [{ checkingInvestmentStatus }, { onInsuranceCreateNavigate }] =
    useInsurancePage()

  const { isMobile } = useBreakpoints()

  const daoPool = String(
    process.env.REACT_APP_DEXE_DAO_ADDRESS
  ).toLocaleLowerCase()

  return (
    <>
      <Header>Insurance</Header>
      <S.Container>
        <S.Content>
          <Flex
            full
            dir={isMobile ? "column" : "row"}
            ai={isMobile ? "center" : "flex-start"}
          >
            <S.Indents top side={isMobile}>
              <S.InsuranceInfoCard>
                <S.InsuranceInfoCardHead title="Headers" />
                <S.InsuranceInfoCardDescription>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <br />
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur
                  </p>
                </S.InsuranceInfoCardDescription>
                <S.InsuranceInfoCardAction
                  size="small"
                  color="default"
                  onClick={onInsuranceCreateNavigate}
                  text="Создать новый пропозал"
                  disabled={checkingInvestmentStatus}
                />
              </S.InsuranceInfoCard>
            </S.Indents>
            <S.Indents top side={isMobile}>
              <S.InsuranceTerminal />
            </S.Indents>
          </Flex>
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
                status={"opened-insurance"}
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
