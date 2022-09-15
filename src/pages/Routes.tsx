import { Route, Routes as Switch, Outlet } from "react-router-dom"
import { lazy, Suspense } from "react"
import { AnimatePresence } from "framer-motion"

import RequireAuth from "pages/RequireAuth"
import UpdateFundContext from "context/UpdateFundContext"

import { Content } from "theme/GlobalStyle"

const Welcome = lazy(() => import("pages/Welcome"))
const TopMembers = lazy(() => import("pages/TopMembers"))
const Invest = lazy(() => import("pages/Invest"))
const Profile = lazy(() => import("pages/Profile"))
const CreateFund = lazy(() => import("pages/CreateFund"))
const CreateFundDaoPool = lazy(() => import("pages/CreateFundDaoPool"))
const CreateFundBasic = lazy(() => import("pages/CreateFundBasic"))
const CreateFundInvestment = lazy(() => import("pages/CreateFundInvestment"))
const Investor = lazy(() => import("pages/Investor"))
const Trader = lazy(() => import("pages/Trader"))
const Swap = lazy(() => import("pages/Swap"))
const Wallet = lazy(() => import("pages/Wallet"))
const Success = lazy(() => import("pages/Success"))
const Notifications = lazy(() => import("pages/Notifications"))
const TokenSelect = lazy(() => import("pages/TokenSelect")) // TODO: my trader profile
const CreateRiskyProposal = lazy(() => import("pages/CreateRiskyProposal"))
const InvestRiskyProposal = lazy(() => import("pages/InvestRiskyProposal"))
const SwapRiskyProposal = lazy(() => import("pages/SwapRiskyProposal"))
const PayDividends = lazy(() => import("pages/PayDividends"))
const CreateInvestmentProposal = lazy(
  () => import("pages/CreateInvestmentProposal")
)
const InvestInvestmentProposal = lazy(
  () => import("pages/InvestInvestmentProposal")
)
const WithdrawInvestmentProposal = lazy(
  () => import("pages/WithdrawInvestmentProposal")
)
// const Insurance = lazy(() => import("pages/Insurance"))

const PrivacyPolicy = lazy(() => import("pages/PrivacyPolicy"))
const ServiceTerms = lazy(() => import("pages/ServiceTerms"))
const Insurance = lazy(() => import("pages/Insurance"))
const FundPositions = lazy(() => import("pages/FundPositions"))
const FundDetails = lazy(() => import("pages/FundDetails")) // TODO: my trader profile
const Investment = lazy(() => import("pages/Investment"))

function Layout() {
  return <Outlet />
}

export default function Routes() {
  return (
    <Content>
      <Suspense fallback={null}>
        <UpdateFundContext>
          <AnimatePresence exitBeforeEnter initial>
            <Switch>
              <Route element={<Layout />}>
                <Route path="welcome" element={<Welcome />} />

                <Route element={<RequireAuth />}>
                  <Route path="me/investor" element={<Investor />} />

                  <Route
                    path="me/trader/profile/:poolType/:poolAddress"
                    element={<Trader />}
                  />

                  <Route path="notifications" element={<Notifications />} />

                  <Route path="wallet" element={<Wallet />} />

                  <Route
                    path="select-token/:type/:poolAddress/:field/:address"
                    element={<TokenSelect />}
                  />

                  <Route
                    path="pool/swap/:poolType/:poolToken/:inputToken/:outputToken"
                    element={<Swap />}
                  />

                  <Route path="pool/invest/:poolAddress" element={<Invest />} />
                  <Route
                    path="pool/profile/:poolType/:poolAddress"
                    element={<Profile />}
                  />

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
                    path="pay-dividends-investment-proposal/:poolAddress/:proposalId"
                    element={<PayDividends />}
                  />
                  <Route path="create-fund" element={<CreateFund />} />
                  <Route
                    path="create-fund/basic"
                    element={<CreateFundBasic />}
                  />
                  <Route
                    path="create-fund/investment"
                    element={<CreateFundInvestment />}
                  />
                  <Route
                    path="create-fund/dao"
                    element={<CreateFundDaoPool />}
                  />
                  <Route path="success/:poolAddress" element={<Success />} />

                  <Route path="insurance/*" element={<Insurance />} />
                  <Route
                    path="fund-positions/:poolAddress/*"
                    element={<FundPositions />}
                  />
                  <Route
                    path="fund-details/:poolAddress/*"
                    element={<FundDetails />}
                  />
                  <Route path="investment/*" element={<Investment />} />

                  <Route path="/*" element={<TopMembers />} />
                </Route>

                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="service-terms" element={<ServiceTerms />} />

                <Route path="*" element={<p>Not found</p>} />
              </Route>
            </Switch>
          </AnimatePresence>
        </UpdateFundContext>
      </Suspense>
    </Content>
  )
}
