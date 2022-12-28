import * as React from "react"
import * as S from "./styled"
import {
  InsuranceAccidentInvestors,
  InsuranceAccidentInvestorsTotalsInfo,
} from "interfaces/insurance"
import InsuranceAccidentMemberRow from "./InsuranceAccidentMemberRow"

import { useWeb3React } from "@web3-react/core"
import theme from "theme"
import { useBreakpoints } from "hooks"
import Table from "components/Table"
import { isNil } from "lodash"

interface Props {
  totals: InsuranceAccidentInvestorsTotalsInfo
  data: InsuranceAccidentInvestors
  loading: boolean
  noData: boolean
}

const InsuranceAccidentMembersTable: React.FC<Props> = (props) => {
  const { totals, data } = props
  const { account } = useWeb3React()
  const { isMobile } = useBreakpoints()

  const TableHead = React.useMemo(
    () => (
      <S.TableHead>
        <S.TableRow>
          <S.TableCell>Members: {totals.users}</S.TableCell>
          <S.TableCell>Amount LP</S.TableCell>
          <S.TableCell>Loss $</S.TableCell>
          <S.TableCell>Сoverage DEXE</S.TableCell>
        </S.TableRow>
      </S.TableHead>
    ),
    [totals]
  )

  const TableHeadFooter = React.useMemo(
    () => (
      <S.TableFooter>
        <S.TableRow fw={600}>
          <S.TableCell>Total:</S.TableCell>
          <S.TableCell>{totals.lp}</S.TableCell>
          <S.TableCell>{totals.loss}</S.TableCell>
          <S.TableCell
            color={!isMobile ? theme.brandColors.secondary : undefined}
          >
            {totals.coverage}
          </S.TableCell>
        </S.TableRow>
      </S.TableFooter>
    ),
    [totals, isMobile]
  )

  const getTableRow = React.useCallback(
    (data) => {
      if (isNil(data)) return <></>

      const isCurrentUser =
        String(data.investor.id).toLocaleLowerCase() ===
        String(account).toLocaleLowerCase()

      return (
        <InsuranceAccidentMemberRow payload={data} active={isCurrentUser} />
      )
    },
    [account]
  )

  console.log(data)

  return (
    <>
      <Table
        row={getTableRow}
        data={isNil(data) ? data : Object.values(data)}
        nodeHead={TableHead}
        nodeFooter={TableHeadFooter}
        pagination
      />
    </>
  )
}

export default InsuranceAccidentMembersTable
