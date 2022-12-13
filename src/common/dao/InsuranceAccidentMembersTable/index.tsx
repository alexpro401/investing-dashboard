import * as React from "react"
import * as S from "./styled"
import { useMemo } from "react"
import { Flex, Text } from "theme"
import {
  InsuranceAccidentInvestor,
  InsuranceAccidentInvestors,
  InsuranceAccidentInvestorsTotalsInfo,
} from "interfaces/insurance"
import InsuranceAccidentMemberRow from "./InsuranceAccidentMemberRow"
import Skeleton from "components/Skeleton"
import { useWeb3React } from "@web3-react/core"

interface Props {
  totals: InsuranceAccidentInvestorsTotalsInfo
  data: InsuranceAccidentInvestors
  loading: boolean
  noData: boolean
}

const InsuranceAccidentMembersTable: React.FC<Props> = (props) => {
  const { totals, data, loading, noData } = props
  const { account } = useWeb3React()

  const tableBody = useMemo(() => {
    if (loading) {
      return Array(10)
        .fill(null)
        .map((_, i) => (
          <S.TableRow gap="12px" key={i}>
            <Skeleton h="13px" />
            <Skeleton h="13px" />
            <Skeleton h="13px" />
            <Skeleton h="13px" />
          </S.TableRow>
        ))
    }

    if (!loading && noData) {
      return (
        <Flex full ai="center" jc="center">
          <Text fz={16} fw={500} color="#e4f2ff">
            No investors
          </Text>
        </Flex>
      )
    }

    return (Object.values(data) as InsuranceAccidentInvestor[]).map((h) => {
      const isCurrentUser =
        h.investor.id === String(account).toLocaleLowerCase()
      return (
        <InsuranceAccidentMemberRow
          key={h.investor.id}
          payload={h}
          color={isCurrentUser ? "#2669EB" : undefined}
          fw={isCurrentUser ? 600 : 400}
        />
      )
    })
  }, [account, data, loading, noData])

  return (
    <>
      <S.Table>
        <S.TableHead>
          <S.TableRow>
            <S.TableCell>Members: {totals.users}</S.TableCell>
            <S.TableCell>Amount LP</S.TableCell>
            <S.TableCell>Loss $</S.TableCell>
            <S.TableCell>Сoverage DEXE</S.TableCell>
          </S.TableRow>
        </S.TableHead>
        <S.TableBody>{tableBody}</S.TableBody>
        <S.TableFooter>
          <S.TableRow fw={600}>
            <S.TableCell>Total:</S.TableCell>
            <S.TableCell>{totals.lp}</S.TableCell>
            <S.TableCell>{totals.loss}</S.TableCell>
            <S.TableCell>{totals.coverage}</S.TableCell>
          </S.TableRow>
        </S.TableFooter>
      </S.Table>
    </>
  )
}

export default InsuranceAccidentMembersTable
