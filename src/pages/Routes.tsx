import { Route, Routes as Switch, Outlet } from "react-router-dom"
import { lazy, Suspense } from "react"
import { AnimatePresence } from "framer-motion"

import RequireAuth from "pages/RequireAuth"

import { Content } from "theme/GlobalStyle"
import { ROUTE_PATHS } from "constants/index"

const Welcome = lazy(() => import("pages/Welcome"))
const TopMembers = lazy(() => import("pages/TopMembers"))
const Invest = lazy(() => import("pages/Invest"))
const DaoProfile = lazy(() => import("pages/DaoProfile"))
const CreateFund = lazy(() => import("pages/CreateFund"))
const CreateFundDaoPool = lazy(() => import("pages/CreateFundDaoPool"))
const CreateFundBasic = lazy(() => import("pages/CreateFundBasic"))
const CreateFundInvestment = lazy(() => import("pages/CreateFundInvestment"))
const Investor = lazy(() => import("pages/Investor"))
const Trader = lazy(() => import("pages/Trader"))
const Pool = lazy(() => import("pages/Pool"))
const Swap = lazy(() => import("pages/Swap"))
const Wallet = lazy(() => import("pages/Wallet"))
const Success = lazy(() => import("pages/Success"))
const Notifications = lazy(() => import("pages/Notifications"))
const CreateRiskyProposal = lazy(() => import("pages/CreateRiskyProposal"))
const InvestRiskyProposal = lazy(() => import("pages/InvestRiskyProposal"))
const SwapRiskyProposal = lazy(() => import("pages/SwapRiskyProposal"))
const PayDividends = lazy(() => import("pages/PayDividends"))
const VotingTerminalPage = lazy(() => import("pages/VotingTerminal"))
const WithdrawDaoPoolPage = lazy(() => import("pages/WithdrawDaoPool"))
const DelegateTerminalPage = lazy(() => import("pages/DelegateTerminal"))
const UndelegateTerminalPage = lazy(() => import("pages/UndelegateTerminal"))
const ValidatorsVotePage = lazy(() => import("pages/ValidatorsVote"))
const CreateInvestmentProposal = lazy(
  () => import("pages/CreateInvestmentProposal")
)
const InvestInvestmentProposal = lazy(
  () => import("pages/InvestInvestmentProposal")
)
const WithdrawInvestmentProposal = lazy(
  () => import("pages/WithdrawInvestmentProposal")
)
const CreateDaoProposalSelectType = lazy(
  () => import("pages/CreateDaoProposalSelectType")
)
const CreateDaoProposalValidatorSelectType = lazy(
  () => import("pages/CreateDaoProposalValidatorSelectType")
)
const CreateDaoProposalValidatorSettings = lazy(
  () => import("pages/CreateDaoProposalValidatorSettings")
)
const CreateDaoProposalValidatorChangeValidatorSettings = lazy(
  () => import("pages/CreateDaoProposalValidatorChangeValidatorSettings")
)
const CreateDaoProposalValidatorChangeVotingSettings = lazy(
  () => import("pages/CreateDaoProposalValidatorChangeVotingSettings")
)
const CreateDaoProposalType = lazy(() => import("pages/CreateDaoProposalType"))
const CreateDaoProposalChangeDaoSettings = lazy(
  () => import("pages/CreateDaoProposalChangeDaoSettings")
)
const CreateDaoProposalChangeVotingSettings = lazy(
  () => import("pages/CreateDaoProposalChangeVotingSettings")
)
const DaoProposalChangeGlobalVotingSettings = lazy(
  () =>
    import(
      "pages/CreateDaoProposalChangeVotingSettings/subpages/GlobalVotingSettings"
    )
)
const DaoProposalChangeTokenDistribution = lazy(
  () =>
    import(
      "pages/CreateDaoProposalChangeVotingSettings/subpages/TokenDistribution"
    )
)
const DaoProposalChangeCustomSettings = lazy(
  () =>
    import(
      "pages/CreateDaoProposalChangeVotingSettings/subpages/CustomSettings"
    )
)
const DaoProposalTokenDistribution = lazy(
  () => import("pages/CreateDaoProposalTokenDistribution")
)
const CreateDaoCustomProposalSelectType = lazy(
  () => import("pages/CreateDaoCustomProposal")
)
const CreateDaoCustomProposalAbi = lazy(
  () => import("pages/CreateDaoCustomProposal/subpages/Abi")
)
const CreateDaoCustomProposalWalletConnect = lazy(
  () => import("pages/CreateDaoCustomProposal/subpages/WalletConnect")
)
const CreateDaoCustomProposalManual = lazy(
  () => import("pages/CreateDaoCustomProposal/subpages/Manual")
)

/* dao proposals */

const DaoProposals = lazy(() => import("pages/DaoProposals"))
const DaoProposalDetails = lazy(() => import("pages/DaoProposalDetails"))
// const Insurance = lazy(() => import("pages/Insurance"))

const PrivacyPolicy = lazy(() => import("pages/PrivacyPolicy"))
const ServiceTerms = lazy(() => import("pages/ServiceTerms"))
const Insurance = lazy(() => import("pages/Insurance"))
const InsuranceCreate = lazy(() => import("pages/InsuranceCreate"))
const FundPositions = lazy(() => import("pages/FundPositions"))
const FundDetails = lazy(() => import("pages/FundDetails")) // TODO: my trader profile
const Investment = lazy(() => import("pages/Investment"))
const DaoPools = lazy(() => import("pages/DaoPools"))
const DaoDelegation = lazy(() => import("pages/DaoDelegation"))
const DaoPoolClaim = lazy(() => import("pages/DaoPoolClaim"))

function Layout() {
  return <Outlet />
}

export default function Routes() {
  return (
    <Content>
      <Suspense fallback={null}>
        <AnimatePresence exitBeforeEnter initial>
          <Switch>
            <Route element={<Layout />}>
              <Route path={ROUTE_PATHS.welcome} element={<Welcome />} />

              <Route element={<RequireAuth />}>
                <Route path={ROUTE_PATHS.meInvestor} element={<Investor />} />

                <Route path={ROUTE_PATHS.meTrader} element={<Trader />} />

                <Route
                  path={ROUTE_PATHS.notifications}
                  element={<Notifications />}
                />

                <Route path={ROUTE_PATHS.wallet} element={<Wallet />} />

                <Route path={ROUTE_PATHS.poolSwap} element={<Swap />} />

                <Route path={ROUTE_PATHS.poolInvest} element={<Invest />} />
                <Route path={ROUTE_PATHS.poolProfile} element={<Pool />} />

                <Route
                  path={ROUTE_PATHS.riskyProposalCreate}
                  element={<CreateRiskyProposal />}
                />
                <Route
                  path={ROUTE_PATHS.riskyProposalInvest}
                  element={<InvestRiskyProposal />}
                />
                <Route
                  path={ROUTE_PATHS.riskyProposalSwap}
                  element={<SwapRiskyProposal />}
                />

                <Route path={ROUTE_PATHS.investment} element={<Investment />} />
                <Route
                  path={ROUTE_PATHS.investmentProposalCreate}
                  element={<CreateInvestmentProposal />}
                />
                <Route
                  path={ROUTE_PATHS.investmentProposalInvest}
                  element={<InvestInvestmentProposal />}
                />
                <Route
                  path={ROUTE_PATHS.investmentProposalWithdraw}
                  element={<WithdrawInvestmentProposal />}
                />
                <Route
                  path={ROUTE_PATHS.dividendsPay}
                  element={<PayDividends />}
                />
                <Route path={ROUTE_PATHS.createFund} element={<CreateFund />} />
                <Route
                  path={ROUTE_PATHS.createFundBasic}
                  element={<CreateFundBasic />}
                />
                <Route
                  path={ROUTE_PATHS.createFundInvestment}
                  element={<CreateFundInvestment />}
                />
                <Route
                  path={ROUTE_PATHS.createFundDao}
                  element={<CreateFundDaoPool />}
                />
                <Route
                  path={ROUTE_PATHS.createFundSuccess}
                  element={<Success />}
                />

                <Route
                  path={ROUTE_PATHS.fundPositions}
                  element={<FundPositions />}
                />
                <Route
                  path={ROUTE_PATHS.fundDetails}
                  element={<FundDetails />}
                />

                <Route path={ROUTE_PATHS.insurance} element={<Insurance />} />
                <Route
                  path={ROUTE_PATHS.insuranceCreate}
                  element={<InsuranceCreate />}
                />

                <Route
                  path={ROUTE_PATHS.daoProposalVoting}
                  element={<VotingTerminalPage />}
                />
                <Route
                  path={ROUTE_PATHS.daoWithdraw}
                  element={<WithdrawDaoPoolPage />}
                />
                <Route
                  path={ROUTE_PATHS.daoDelegatee}
                  element={<DelegateTerminalPage />}
                />
                <Route
                  path={ROUTE_PATHS.daoUnDelegatee}
                  element={<UndelegateTerminalPage />}
                />
                <Route
                  path={ROUTE_PATHS.daoProposalValidatorsVote}
                  element={<ValidatorsVotePage />}
                />

                {/* dao profile */}
                <Route path={ROUTE_PATHS.daoList} element={<DaoPools />} />
                <Route path={ROUTE_PATHS.daoItem} element={<DaoProfile />} />
                <Route
                  path={ROUTE_PATHS.daoDelegation}
                  element={<DaoDelegation />}
                />
                <Route path={ROUTE_PATHS.daoClaim} element={<DaoPoolClaim />} />

                {/* create proposals */}
                <Route
                  path={ROUTE_PATHS.daoProposalCreateSelectType}
                  element={<CreateDaoProposalSelectType />}
                />

                {/* default proposals */}
                <Route
                  path={ROUTE_PATHS.daoProposalCreateCustom}
                  element={<CreateDaoProposalType />}
                />
                <Route
                  path={ROUTE_PATHS.daoProposalCreateProfile}
                  element={<CreateDaoProposalChangeDaoSettings />}
                />
                <Route
                  path={ROUTE_PATHS.daoProposalCreateValidatorSettings}
                  element={<CreateDaoProposalValidatorSettings />}
                />
                <Route
                  path={ROUTE_PATHS.daoProposalCreateTokenDistribution}
                  element={<DaoProposalTokenDistribution />}
                />
                <Route
                  path={ROUTE_PATHS.daoProposalCreateInternalSelectType}
                  element={<CreateDaoProposalChangeVotingSettings />}
                />

                {/* change voting settings */}
                <Route
                  path={ROUTE_PATHS.daoProposalCreateInternalGlobal}
                  element={<DaoProposalChangeGlobalVotingSettings />}
                />
                <Route
                  path={ROUTE_PATHS.daoProposalCreateInternalTokenDistribution}
                  element={<DaoProposalChangeTokenDistribution />}
                />
                <Route
                  path={ROUTE_PATHS.daoProposalCreateInternalCustom}
                  element={<DaoProposalChangeCustomSettings />}
                />

                {/* internal proposals */}
                <Route
                  path={
                    ROUTE_PATHS.daoProposalCreateInternalValidatorsSelectType
                  }
                  element={<CreateDaoProposalValidatorSelectType />}
                />
                <Route
                  path={ROUTE_PATHS.daoProposalCreateInternalValidatorsSettings}
                  element={
                    <CreateDaoProposalValidatorChangeValidatorSettings />
                  }
                />
                <Route
                  path={
                    ROUTE_PATHS.daoProposalCreateInternalValidatorsVotingSettings
                  }
                  element={<CreateDaoProposalValidatorChangeVotingSettings />}
                />

                {/* creating custom proposals */}
                <Route
                  path={ROUTE_PATHS.daoProposalCreateCustomSelectType}
                  element={<CreateDaoCustomProposalSelectType />}
                />
                <Route
                  path={ROUTE_PATHS.daoProposalCreateCustomABI}
                  element={<CreateDaoCustomProposalAbi />}
                />
                <Route
                  path={ROUTE_PATHS.daoProposalCreateCustomWalletConnect}
                  element={<CreateDaoCustomProposalWalletConnect />}
                />
                <Route
                  path={ROUTE_PATHS.daoProposalCreateCustomManual}
                  element={<CreateDaoCustomProposalManual />}
                />

                {/* Dao Proposals */}
                <Route
                  path={ROUTE_PATHS.daoProposalList}
                  element={<DaoProposals />}
                />
                <Route
                  path={ROUTE_PATHS.daoProposalItem}
                  element={<DaoProposalDetails />}
                />

                <Route path="/*" element={<TopMembers />} />
              </Route>

              <Route
                path={ROUTE_PATHS.privacyPolicy}
                element={<PrivacyPolicy />}
              />
              <Route
                path={ROUTE_PATHS.serviceTerms}
                element={<ServiceTerms />}
              />

              <Route path="*" element={<p>Not found</p>} />
            </Route>
          </Switch>
        </AnimatePresence>
      </Suspense>
    </Content>
  )
}
