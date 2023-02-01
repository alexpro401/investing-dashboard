import { generatePath, RouterProvider } from "react-router-dom"

import { createBrowserRouter, Navigate, Outlet } from "react-router-dom"
import { lazy, Suspense } from "react"
import { AnimatePresence } from "framer-motion"

import RequireAuth from "pages/RequireAuth"

import { Content } from "theme/GlobalStyle"
import { ROUTE_PATHS } from "consts"
import { shortenAddress } from "../utils"

const Welcome = lazy(() => import("pages/Welcome"))
const TopMembers = lazy(() => import("pages/TopMembers"))
const Invest = lazy(() => import("pages/Invest"))
const DaoProfile = lazy(() => import("pages/DaoProfile"))
const CreateFund = lazy(() => import("pages/CreateFund"))
const CreateFundDaoPool = lazy(
  () => import("pages/CreateFund/CreateFundDaoPool")
)
const CreateFundBasic = lazy(() => import("pages/CreateFund/CreateFundBasic"))
const CreateFundInvestment = lazy(
  () => import("pages/CreateFund/CreateFundInvestment")
)
const Investor = lazy(() => import("pages/Investor"))
const Trader = lazy(() => import("pages/Trader"))
const PoolProfile = lazy(() => import("pages/PoolProfile"))
const Swap = lazy(() => import("pages/Swap"))
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

const GovPoolProposals = lazy(() => import("pages/GovPoolProposals"))

const CreateDaoProposalSelectType = lazy(
  () => import("pages/GovPoolProposals/CreateDaoProposalSelectType")
)
const CreateDaoProposalValidatorSelectType = lazy(
  () => import("pages/GovPoolProposals/CreateDaoProposalValidatorSelectType")
)
const CreateDaoProposalValidatorSettings = lazy(
  () => import("pages/GovPoolProposals/CreateDaoProposalValidatorSettings")
)
const CreateDaoProposalValidatorChangeValidatorSettings = lazy(
  () =>
    import(
      "pages/GovPoolProposals/CreateDaoProposalValidatorChangeValidatorSettings"
    )
)
const CreateDaoProposalValidatorChangeVotingSettings = lazy(
  () =>
    import(
      "pages/GovPoolProposals/CreateDaoProposalValidatorChangeVotingSettings"
    )
)
const CreateDaoProposalType = lazy(
  () => import("pages/GovPoolProposals/CreateDaoProposalType")
)
const CreateDaoProposalChangeDaoSettings = lazy(
  () => import("pages/GovPoolProposals/CreateDaoProposalChangeDaoSettings")
)
const CreateDaoProposalChangeVotingSettings = lazy(
  () => import("pages/GovPoolProposals/CreateDaoProposalChangeVotingSettings")
)
const DaoProposalChangeGlobalVotingSettings = lazy(
  () =>
    import(
      "pages/GovPoolProposals/CreateDaoProposalChangeVotingSettings/subpages/GlobalVotingSettings"
    )
)
const DaoProposalChangeTokenDistribution = lazy(
  () =>
    import(
      "pages/GovPoolProposals/CreateDaoProposalChangeVotingSettings/subpages/TokenDistribution"
    )
)
const DaoProposalTokenSale = lazy(
  () => import("pages/GovPoolProposals/CreateDaoProposalTokenSale")
)
const DaoProposalChangeCustomSettings = lazy(
  () =>
    import(
      "pages/GovPoolProposals/CreateDaoProposalChangeVotingSettings/subpages/CustomSettings"
    )
)
const DaoProposalTokenDistribution = lazy(
  () => import("pages/GovPoolProposals/CreateDaoProposalTokenDistribution")
)
const CreateDaoCustomProposalSelectType = lazy(
  () => import("pages/GovPoolProposals/CreateDaoCustomProposal")
)
const CreateDaoCustomProposalAbi = lazy(
  () => import("pages/GovPoolProposals/CreateDaoCustomProposal/subpages/Abi")
)
const CreateDaoCustomProposalWalletConnect = lazy(
  () =>
    import(
      "pages/GovPoolProposals/CreateDaoCustomProposal/subpages/WalletConnect"
    )
)
const CreateDaoCustomProposalManual = lazy(
  () => import("pages/GovPoolProposals/CreateDaoCustomProposal/subpages/Manual")
)

/* dao proposals */

const DaoProposals = lazy(() => import("pages/GovPoolProposals/DaoProposals"))
const DaoProposalDetails = lazy(
  () => import("pages/GovPoolProposals/DaoProposalDetails")
)
// const Insurance = lazy(() => import("pages/Insurance"))

const PrivacyPolicy = lazy(() => import("pages/PrivacyPolicy"))
const ServiceTerms = lazy(() => import("pages/ServiceTerms"))
const Insurance = lazy(() => import("pages/Insurance"))
const InsuranceCreate = lazy(() => import("pages/InsuranceCreate"))
const FundPositions = lazy(() => import("pages/FundPositions"))
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
            path: ROUTE_PATHS.poolSwap,
            element: <Swap />,
          },
          {
            path: ROUTE_PATHS.poolInvest,
            element: <Invest />,
          },
          {
            path: ROUTE_PATHS.poolProfile,
            element: <PoolProfile />,
            handle: (params) => [
              {
                label: "Pools",
                path: generatePath(ROUTE_PATHS.topMembers, {
                  "*": "all",
                }),
              },
              {
                label: shortenAddress(params.poolAddress),
                path: generatePath(ROUTE_PATHS.poolProfile, {
                  poolAddress: params.poolAddress,
                  "*": "",
                }),
              },
            ],
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
            handle: (params) => [
              {
                label: "DAOs",
                path: "/dao/list/top",
              },
              {
                label: `DAO ${params.daoAddress}`,
                path: generatePath(ROUTE_PATHS.daoItem, {
                  daoAddress: params.daoAddress,
                }),
              },
            ],
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
            element: <GovPoolProposals />,
            children: [
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
                path: ROUTE_PATHS.daoProposalCreateTokenSale,
                element: <DaoProposalTokenSale />,
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
                handle: (params) => [
                  {
                    label: "DAOs",
                    path: "/dao/list/top",
                  },
                  {
                    label: `DAO ${shortenAddress(params.daoAddress)}`,
                    path: generatePath(ROUTE_PATHS.daoItem, {
                      daoAddress: params.daoAddress,
                    }),
                  },
                  {
                    label: `Proposals`,
                    path: generatePath(ROUTE_PATHS.daoProposalList, {
                      daoAddress: params.daoAddress,
                      "*": "opened", // FIXME
                    }),
                  },
                ],
              },
              {
                path: ROUTE_PATHS.daoProposalItem,
                element: <DaoProposalDetails />,
                handle: (params) => [
                  {
                    label: "DAOs",
                    path: "/dao/list/top",
                  },
                  {
                    label: `DAO ${shortenAddress(params.daoAddress)}`,
                    path: generatePath(ROUTE_PATHS.daoItem, {
                      daoAddress: params.daoAddress,
                    }),
                  },
                  {
                    label: `Proposals`,
                    path: generatePath(ROUTE_PATHS.daoProposalList, {
                      daoAddress: params.daoAddress,
                      "*": "opened", // FIXME
                    }),
                  },
                ],
              },
            ],
          },
          {
            path: ROUTE_PATHS.topMembers,
            element: <TopMembers />,
          },
          {
            path: "/",
            element: <Navigate replace to={ROUTE_PATHS.topMembers} />,
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
