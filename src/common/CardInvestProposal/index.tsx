import * as React from "react"
import { useBreakpoints, useInvestProposalView } from "hooks"
import { WrappedInvestProposalView } from "types"
import CardInvestProposalBodyInvestor from "./CardInvestProposalBodyInvestor"
import CardInvestProposalBodyTrader from "./CardInvestProposalBodyTrader"
import * as S from "./styled"
import CardActions from "components/CardActions"
import { AnimatePresence } from "framer-motion"
import { generatePath, useNavigate } from "react-router-dom"
import { ROUTE_PATHS } from "consts"
import useRequestDividendsContext from "modals/RequestDividend/useRequestDividendsContext"
import UpdateInvestProposalForm from "forms/UpdateInvestProposalForm"
import { useTranslation } from "react-i18next"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  payload: WrappedInvestProposalView
}

const CardInvestProposal: React.FC<Props> = ({ payload, ...rest }) => {
  const { utilityIds } = payload

  const proposalView = useInvestProposalView(payload)
  const {
    isTrader,
    proposalMetadata,
    proposalPool,
    expirationTimestamp,
    maxSizeLP,
    fullness,
    onUpdateRestrictions,
  } = proposalView

  const navigate = useNavigate()
  const { t } = useTranslation()
  const { isDesktop } = useBreakpoints()
  const { requestDividends } = useRequestDividendsContext()

  const [isShowActions, setIsShowActions] = React.useState<boolean>(false)
  const toggleActions = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation()
      setIsShowActions((prev) => !prev)
    },
    []
  )
  const [isSettingsOpen, setIsSettingsOpen] = React.useState<boolean>(false)
  const toggleSettings = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation()
      setIsSettingsOpen((prev) => !prev)
    },
    []
  )

  const TerminalRoute = {
    Invest: ROUTE_PATHS.investmentProposalInvest,
    Withdraw: ROUTE_PATHS.investmentProposalWithdraw,
    PayDividends: ROUTE_PATHS.dividendsPay,
  }

  const onTerminalNavigate = React.useCallback(
    (type: string) => {
      navigate(
        generatePath(type, {
          poolAddress: utilityIds.investPoolAddress,
          proposalId: String(utilityIds.proposalId),
        })
      )
    },
    [navigate, utilityIds]
  )

  const actions = React.useMemo(
    () =>
      isDesktop
        ? []
        : isTrader
        ? [
            {
              label: t("card-invest-proposal.action-withdraw"),
              onClick: () => onTerminalNavigate(TerminalRoute.Withdraw),
            },
            {
              label: t("card-invest-proposal.action-deposit"),
              onClick: () => onTerminalNavigate(TerminalRoute.Invest),
            },
            {
              label: t("card-invest-proposal.action-claim"),
              onClick: () =>
                requestDividends(
                  utilityIds.investPoolAddress,
                  String(utilityIds.proposalId)
                ),
            },
            {
              label: t("card-invest-proposal.action-pay-dividends"),
              onClick: () => onTerminalNavigate(TerminalRoute.PayDividends),
            },
          ]
        : [
            {
              label: t("card-invest-proposal.action-stake-lp"),
              onClick: () => onTerminalNavigate(TerminalRoute.Invest),
            },
            {
              label: t("card-invest-proposal.action-request-dividends"),
              onClick: () =>
                requestDividends(
                  utilityIds.investPoolAddress,
                  String(utilityIds.proposalId)
                ),
            },
          ],
    [
      t,
      isTrader,
      isDesktop,
      utilityIds,
      TerminalRoute,
      requestDividends,
      onTerminalNavigate,
    ]
  )

  return (
    <S.Root {...rest}>
      <S.CardInvestProposalBody onClick={toggleActions}>
        <S.CardInvestProposalGrid>
          {isTrader ? (
            <CardInvestProposalBodyTrader
              poolAddress={utilityIds.investPoolAddress}
              payload={proposalView}
              isSettingsOpen={isSettingsOpen}
              toggleSettings={toggleSettings}
              onPayDividends={() =>
                onTerminalNavigate(TerminalRoute.PayDividends)
              }
              onWithdraw={() => onTerminalNavigate(TerminalRoute.Withdraw)}
            />
          ) : (
            <CardInvestProposalBodyInvestor
              poolAddress={utilityIds.investPoolAddress}
              payload={proposalView}
              onStake={() => onTerminalNavigate(TerminalRoute.Invest)}
              onRequestDividends={() =>
                requestDividends(
                  utilityIds.investPoolAddress,
                  String(utilityIds.proposalId)
                )
              }
            />
          )}
        </S.CardInvestProposalGrid>
      </S.CardInvestProposalBody>
      <AnimatePresence>
        <CardActions actions={actions} visible={isShowActions} />
      </AnimatePresence>
      <S.CardInvestProposalUpdateFormWrp>
        <UpdateInvestProposalForm
          ticker={proposalMetadata.ticker}
          visible={isSettingsOpen}
          setVisible={setIsSettingsOpen}
          proposalPool={proposalPool}
          proposalId={utilityIds.proposalId}
          successCallback={onUpdateRestrictions}
          timestamp={String(expirationTimestamp)}
          maxSizeLP={maxSizeLP}
          fullness={fullness}
        />
      </S.CardInvestProposalUpdateFormWrp>
    </S.Root>
  )
}

export default CardInvestProposal
