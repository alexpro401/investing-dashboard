import { Route, Routes as Switch, Outlet } from "react-router-dom"
import { lazy, Suspense } from "react"
import { AnimatePresence } from "framer-motion"

import RequireAuth from "pages/RequireAuth"

import { Content } from "theme/GlobalStyle"

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
  () => import("pages/CreateDaoCustomProposalSelectType")
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
const DaoPoolsList = lazy(() => import("pages/DaoPoolsList"))

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
              <Route path="welcome" element={<Welcome />} />

              <Route element={<RequireAuth />}>
                <Route path="me/investor" element={<Investor />} />
                <Route
                  path="dao/:daoPoolAddress/vote/:proposalId"
                  element={<VotingTerminalPage />}
                />
                <Route
                  path="dao/:daoPoolAddress/withdraw"
                  element={<WithdrawDaoPoolPage />}
                />
                <Route
                  path="dao/:daoPoolAddress/delegate"
                  element={<DelegateTerminalPage />}
                />
                <Route
                  path="dao/:daoPoolAddress/undelegate/:delegatee"
                  element={<UndelegateTerminalPage />}
                />
                <Route
                  path="dao/:daoPoolAddress/validators-vote/:proposalId"
                  element={<ValidatorsVotePage />}
                />

                <Route path="me/trader" element={<Trader />} />

                <Route path="notifications" element={<Notifications />} />

                <Route path="wallet" element={<Wallet />} />

                <Route
                  path="pool/swap/:poolType/:poolToken/:inputToken/:outputToken/*"
                  element={<Swap />}
                />

                <Route path="pool/invest/:poolAddress" element={<Invest />} />
                <Route path="pool/profile/:poolAddress" element={<Pool />} />

                <Route
                  path="create-risky-proposal/:poolAddress/:tokenAddress/*"
                  element={<CreateRiskyProposal />}
                />
                <Route
                  path="invest-risky-proposal/:poolAddress/:proposalId"
                  element={<InvestRiskyProposal />}
                />
                <Route
                  path="swap-risky-proposal/:poolAddress/:proposalId/:direction"
                  element={<SwapRiskyProposal />}
                />
                <Route
                  path="create-invest-proposal/:poolAddress"
                  element={<CreateInvestmentProposal />}
                />
                <Route
                  path="invest-investment-proposal/:poolAddress/:proposalId"
                  element={<InvestInvestmentProposal />}
                />
                <Route
                  path="withdraw-investment-proposal/:poolAddress/:proposalId"
                  element={<WithdrawInvestmentProposal />}
                />
                <Route
                  path="pay-dividends-investment-proposal/:poolAddress/:proposalId/*"
                  element={<PayDividends />}
                />
                <Route path="create-fund" element={<CreateFund />} />
                <Route
                  path="create-fund/basic/*"
                  element={<CreateFundBasic />}
                />
                <Route
                  path="create-fund/investment/*"
                  element={<CreateFundInvestment />}
                />
                <Route path="create-fund/dao" element={<CreateFundDaoPool />} />
                <Route path="success/:poolAddress" element={<Success />} />

                <Route path="insurance" element={<Insurance />} />
                <Route path="insurance/create" element={<InsuranceCreate />} />
                <Route
                  path="fund-positions/:poolAddress/*"
                  element={<FundPositions />}
                />
                <Route
                  path="fund-details/:poolAddress/*"
                  element={<FundDetails />}
                />
                <Route path="investment/*" element={<Investment />} />

                {/* dao profile */}
                <Route path="dao/list/:filter" element={<DaoPoolsList />} />
                <Route path="dao/:daoAddress" element={<DaoProfile />} />

                {/* create proposals */}
                <Route
                  path="dao/:daoAddress/create-proposal"
                  element={<CreateDaoProposalSelectType />}
                />

                {/* default proposals */}
                <Route
                  path="dao/:daoAddress/create-proposal/custom"
                  element={<CreateDaoProposalType />}
                />
                <Route
                  path="dao/:daoAddress/create-proposal/change-dao-settings"
                  element={<CreateDaoProposalChangeDaoSettings />}
                />
                <Route
                  path="dao/:daoAddress/create-proposal/validator-settings"
                  element={<CreateDaoProposalValidatorSettings />}
                />
                <Route
                  path="dao/:daoAddress/create-proposal/token-distribution"
                  element={<DaoProposalTokenDistribution />}
                />
                <Route
                  path="dao/:daoAddress/create-proposal/change-voting-settings"
                  element={<CreateDaoProposalChangeVotingSettings />}
                />

                {/* change voting settings */}
                <Route
                  path="dao/:daoAddress/create-proposal/change-voting-settings/global-voting"
                  element={<DaoProposalChangeGlobalVotingSettings />}
                />
                <Route
                  path="dao/:daoAddress/create-proposal/change-voting-settings/token-distribution"
                  element={<DaoProposalChangeTokenDistribution />}
                />
                <Route
                  path="dao/:daoAddress/create-proposal/change-voting-settings/custom/:executorAddress"
                  element={<DaoProposalChangeCustomSettings />}
                />

                {/* internal proposals */}
                <Route
                  path="dao/:daoAddress/create-validator-proposal"
                  element={<CreateDaoProposalValidatorSelectType />}
                />
                <Route
                  path="/dao/:daoAddress/create-validator-proposal/validator-settings"
                  element={
                    <CreateDaoProposalValidatorChangeValidatorSettings />
                  }
                />
                <Route
                  path="/dao/:daoAddress/create-validator-proposal/voting-settings"
                  element={<CreateDaoProposalValidatorChangeVotingSettings />}
                />

                {/* creating custom proposals */}
                <Route
                  path="dao/:daoAddress/create-custom-proposal/:executorAddress"
                  element={<CreateDaoCustomProposalSelectType />}
                />

                {/* Dao Proposals */}
                <Route
                  path="dao/:daoAddress/proposals/*"
                  element={<DaoProposals />}
                />
                <Route
                  path="dao/:daoAddress/proposal/:proposalId"
                  element={<DaoProposalDetails />}
                />

                <Route path="/*" element={<TopMembers />} />
              </Route>

              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="service-terms" element={<ServiceTerms />} />

              <Route path="*" element={<p>Not found</p>} />
            </Route>
          </Switch>
        </AnimatePresence>
      </Suspense>
    </Content>
  )
}
