import * as React from "react"
import { isEmpty } from "lodash"
import { v4 as uuidv4 } from "uuid"
import { SpiralSpinner } from "react-spinners-kit"

import { useInvestorRiskyPositionList } from "hooks"

import { Center } from "theme"
import { NoDataMessage, CardInvestorRiskyPosition } from "common"
import Tooltip from "components/Tooltip"
import LoadMore from "components/LoadMore"

import * as S from "./styled"

interface IProps {
  closed: boolean
}

const InvestmentRiskyPositionsList: React.FC<IProps> = ({ closed }) => {
  const [data, loading, fetchMore] = useInvestorRiskyPositionList(closed)

  return (
    <>
      {isEmpty(data) ? (
        loading ? (
          <Center>
            <SpiralSpinner size={30} loading />
          </Center>
        ) : (
          <NoDataMessage />
        )
      ) : (
        <S.InvestorRiskyPositionsListWrp>
          <S.InvestorRiskyPositionsListHead>
            <S.InvestorRiskyPositionsListHeadItem>
              Fund
            </S.InvestorRiskyPositionsListHeadItem>

            <S.InvestorRiskyPositionsListHeadItem>
              My Volume
            </S.InvestorRiskyPositionsListHeadItem>

            <S.InvestorRiskyPositionsListHeadItem>
              <span>Entry Price</span>
              <Tooltip id={uuidv4()}>Explain Entry Price</Tooltip>
            </S.InvestorRiskyPositionsListHeadItem>

            <S.InvestorRiskyPositionsListHeadItem>
              <span>Current price</span>
              <Tooltip id={uuidv4()}>Explain Current price</Tooltip>
            </S.InvestorRiskyPositionsListHeadItem>

            <S.InvestorRiskyPositionsListHeadItem>
              P&L in %
            </S.InvestorRiskyPositionsListHeadItem>
            <S.InvestorRiskyPositionsListHeadItem />
          </S.InvestorRiskyPositionsListHead>
          <S.InvestorRiskyPositionsListBody>
            {data.map((p) => (
              <CardInvestorRiskyPosition key={p.id} payload={p} />
            ))}
            <LoadMore isLoading={loading} handleMore={fetchMore} />
          </S.InvestorRiskyPositionsListBody>
        </S.InvestorRiskyPositionsListWrp>
      )}
    </>
  )
}

export default InvestmentRiskyPositionsList
