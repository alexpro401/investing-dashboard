import { RouterProvider } from "react-router-dom"

import { createBrowserRouter, Navigate, Outlet } from "react-router-dom"
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

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Content>
        <Suspense fallback={<></>}>
          <AnimatePresence exitBeforeEnter initial>
            <Outlet />
          </AnimatePresence>
        </Suspense>
      </Content>
    ),
    children: [
      {
        path: ROUTE_PATHS.welcome,
        element: <Welcome />,
      },
      {
        path: ROUTE_PATHS.privacyPolicy,
        element: <PrivacyPolicy />,
      },
      {
        path: ROUTE_PATHS.serviceTerms,
        element: <ServiceTerms />,
      },
      {
        path: "/",
        element: <RequireAuth />,
        children: [
          {
            path: ROUTE_PATHS.meInvestor,
            element: <Investor />,
          },
          {
            path: ROUTE_PATHS.meTrader,
            element: <Trader />,
          },

          {
            path: ROUTE_PATHS.notifications,
            element: <Notifications />,
          },

          {
            path: ROUTE_PATHS.wallet,
            element: <Wallet />,
          },

          {
            path: ROUTE_PATHS.poolSwap,
            element: <Swap />,
          },
          {
            path: ROUTE_PATHS.poolInvest,
            element: <Invest />,
          },
          {
            path: ROUTE_PATHS.poolProfile,
            element: <Pool />,
          },
          {
            path: ROUTE_PATHS.riskyProposalCreate,
            element: <CreateRiskyProposal />,
          },
          {
            path: ROUTE_PATHS.riskyProposalInvest,
            element: <InvestRiskyProposal />,
          },
          {
            path: ROUTE_PATHS.riskyProposalSwap,
            element: <SwapRiskyProposal />,
          },
          {
            path: ROUTE_PATHS.investment,
            element: <Investment />,
          },
          {
            path: ROUTE_PATHS.investmentProposalCreate,
            element: <CreateInvestmentProposal />,
          },
          {
            path: ROUTE_PATHS.investmentProposalInvest,
            element: <InvestInvestmentProposal />,
          },
          {
            path: ROUTE_PATHS.investmentProposalWithdraw,
            element: <WithdrawInvestmentProposal />,
          },
          {
            path: ROUTE_PATHS.dividendsPay,
            element: <PayDividends />,
          },
          {
            path: ROUTE_PATHS.createFund,
            element: <CreateFund />,
          },
          {
            path: ROUTE_PATHS.createFundBasic,
            element: <CreateFundBasic />,
          },
          {
            path: ROUTE_PATHS.createFundInvestment,
            element: <CreateFundInvestment />,
          },
          {
            path: ROUTE_PATHS.createFundDao,
            element: <CreateFundDaoPool />,
          },
          {
            path: ROUTE_PATHS.createFundSuccess,
            element: <Success />,
          },
          {
            path: ROUTE_PATHS.fundPositions,
            element: <FundPositions />,
          },
          {
            path: ROUTE_PATHS.fundDetails,
            element: <FundDetails />,
          },
          {
            path: ROUTE_PATHS.insurance,
            element: <Insurance />,
          },
          {
            path: ROUTE_PATHS.insuranceCreate,
            element: <InsuranceCreate />,
          },
          {
            path: ROUTE_PATHS.daoProposalVoting,
            element: <VotingTerminalPage />,
          },
          {
            path: ROUTE_PATHS.daoWithdraw,
            element: <WithdrawDaoPoolPage />,
          },
          {
            path: ROUTE_PATHS.daoDelegatee,
            element: <DelegateTerminalPage />,
          },
          {
            path: ROUTE_PATHS.daoUnDelegatee,
            element: <UndelegateTerminalPage />,
          },
          {
            path: ROUTE_PATHS.daoProposalValidatorsVote,
            element: <ValidatorsVotePage />,
          },
          {
            path: ROUTE_PATHS.daoList,
            element: <DaoPools />,
          },
          {
            path: ROUTE_PATHS.daoItem,
            element: <DaoProfile />,
            handle: (params) => ({
              title: `DAO ${params.daoAddress}`,
            }),
          },
          {
            path: ROUTE_PATHS.daoDelegation,
            element: <DaoDelegation />,
          },
          {
            path: ROUTE_PATHS.daoClaim,
            element: <DaoPoolClaim />,
          },
          {
            path: ROUTE_PATHS.daoProposalCreateSelectType,
            element: <CreateDaoProposalSelectType />,
          },
          {
            path: ROUTE_PATHS.daoProposalCreateCustom,
            element: <CreateDaoProposalType />,
          },
          {
            path: ROUTE_PATHS.daoProposalCreateProfile,
            element: <CreateDaoProposalChangeDaoSettings />,
          },
          {
            path: ROUTE_PATHS.daoProposalCreateValidatorSettings,
            element: <CreateDaoProposalValidatorSettings />,
          },
          {
            path: ROUTE_PATHS.daoProposalCreateTokenDistribution,
            element: <DaoProposalTokenDistribution />,
          },
          {
            path: ROUTE_PATHS.daoProposalCreateInternalSelectType,
            element: <CreateDaoProposalChangeVotingSettings />,
          },
          {
            path: ROUTE_PATHS.daoProposalCreateInternalGlobal,
            element: <DaoProposalChangeGlobalVotingSettings />,
          },
          {
            path: ROUTE_PATHS.daoProposalCreateInternalTokenDistribution,
            element: <DaoProposalChangeTokenDistribution />,
          },
          {
            path: ROUTE_PATHS.daoProposalCreateInternalCustom,
            element: <DaoProposalChangeCustomSettings />,
          },
          {
            path: ROUTE_PATHS.daoProposalCreateInternalValidatorsSelectType,
            element: <CreateDaoProposalValidatorSelectType />,
          },
          {
            path: ROUTE_PATHS.daoProposalCreateInternalValidatorsSettings,
            element: <CreateDaoProposalValidatorChangeValidatorSettings />,
          },
          {
            path: ROUTE_PATHS.daoProposalCreateInternalValidatorsVotingSettings,
            element: <CreateDaoProposalValidatorChangeVotingSettings />,
          },
          {
            path: ROUTE_PATHS.daoProposalCreateCustomSelectType,
            element: <CreateDaoCustomProposalSelectType />,
          },
          {
            path: ROUTE_PATHS.daoProposalCreateCustomABI,
            element: <CreateDaoCustomProposalAbi />,
          },
          {
            path: ROUTE_PATHS.daoProposalCreateCustomWalletConnect,
            element: <CreateDaoCustomProposalWalletConnect />,
          },
          {
            path: ROUTE_PATHS.daoProposalCreateCustomManual,
            element: <CreateDaoCustomProposalManual />,
          },
          {
            path: ROUTE_PATHS.daoProposalList,
            element: <DaoProposals />,
            handle: (params) => ({
              title: `DAO ${params.daoAddress}/proposals`,
            }),
          },
          {
            path: ROUTE_PATHS.daoProposalItem,
            element: <DaoProposalDetails />,
          },
          {
            path: ROUTE_PATHS.topMembers,
            element: <TopMembers />,
          },
        ],
      },
      {
        path: "*",
        element: <Navigate replace to={ROUTE_PATHS.welcome} />,
      },
    ],
  },
])

export default function Routes() {
  return <RouterProvider router={router} />
}
