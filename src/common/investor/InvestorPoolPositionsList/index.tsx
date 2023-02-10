// <S.ListTopWrp>
// <S.PageSubTabs tabs={tabs} />
// {!isMobile && (
//   <S.ListTopInfo>
//     <span>Whitelist positions</span>
//     <Tooltip id={uuidv4()}>Info???</Tooltip>
//   </S.ListTopInfo>
// )}
// </S.ListTopWrp>

import { FC, useMemo } from "react"
import { v4 as uuidv4 } from "uuid"
import { isEmpty } from "lodash"
import { useTranslation } from "react-i18next"
import { PulseSpinner } from "react-spinners-kit"

import { useActiveWeb3React } from "hooks"
import { InvestorPositionsQuery } from "queries"
import { graphClientInvestors } from "utils/graphClient"
import useQueryPagination from "hooks/useQueryPagination"
import { InvestorPosition } from "interfaces/thegraphs/invest-pools"

import * as S from "./styled"
import { Center } from "theme"
import Tooltip from "components/Tooltip"
import LoadMore from "components/LoadMore"
import { NoDataMessage, CardInvestorPosition } from "common"
import InvestorPositionInPoolContextProvider from "context/investor/positions/InvestorPositionInPoolContext"

interface IProps {
  closed: boolean
}

const InvestorPoolPositionsList: FC<IProps> = ({ closed }) => {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const [{ data, loading }, fetchMore] = useQueryPagination<InvestorPosition>({
    query: InvestorPositionsQuery,
    variables: useMemo(
      () => ({ address: String(account).toLowerCase(), closed }),
      [closed, account]
    ),
    pause: !account,
    context: graphClientInvestors,
    formatter: (d) => d.investorPoolPositions,
  })

  if (!account || (isEmpty(data) && loading)) {
    return (
      <Center>
        <PulseSpinner />
      </Center>
    )
  }

  if (isEmpty(data) && !loading) {
    return <NoDataMessage />
  }

  return (
    <div>
      <S.InvestorPositionsListWrp>
        <S.InvestorPositionsListHead bigGap={closed}>
          <S.InvestorPositionsListHeadItem>
            {t("investor-pool-positions-list.label-pool")}
          </S.InvestorPositionsListHeadItem>
          <S.InvestorPositionsListHeadItem>
            {t("investor-pool-positions-list.label-my-volume")}
          </S.InvestorPositionsListHeadItem>
          <S.InvestorPositionsListHeadItem>
            <span>{t("investor-pool-positions-list.label-entry-price")}</span>
            <Tooltip id={uuidv4()}>
              {t("investor-pool-positions-list.tooltip-msg-entry-price")}
            </Tooltip>
          </S.InvestorPositionsListHeadItem>
          <S.InvestorPositionsListHeadItem>
            <span>{t("investor-pool-positions-list.label-current-price")}</span>
            <Tooltip id={uuidv4()}>
              {t("investor-pool-positions-list.tooltip-msg-current-price")}
            </Tooltip>
          </S.InvestorPositionsListHeadItem>
          <S.InvestorPositionsListHeadItem>
            <span>{t("investor-pool-positions-list.label-pnl")}</span>
          </S.InvestorPositionsListHeadItem>
          <S.InvestorPositionsListHeadItem>
            <span>{t("investor-pool-positions-list.label-commission")}</span>
            <Tooltip id={uuidv4()}>
              {t("investor-pool-positions-list.tooltip-msg-commission")}
            </Tooltip>
          </S.InvestorPositionsListHeadItem>
          <S.InvestorPositionsListHeadItem />
        </S.InvestorPositionsListHead>
        {data.map((p) => (
          <InvestorPositionInPoolContextProvider key={p.id} position={p}>
            <CardInvestorPosition />
          </InvestorPositionInPoolContextProvider>
        ))}
      </S.InvestorPositionsListWrp>
      <LoadMore isLoading={loading && !!data.length} handleMore={fetchMore} />
    </div>
  )
}

export default InvestorPoolPositionsList
