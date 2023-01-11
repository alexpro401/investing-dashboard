import React, { useContext, useMemo, useCallback } from "react"
import { useParams } from "react-router-dom"
import { BigNumber } from "@ethersproject/bignumber"

import theme, { Flex } from "theme"
import TabFallback from "./TabFallback"
import { Card, Icon } from "common"
import PaginationTable from "components/PaginationTable"
import { v4 as uuidv4 } from "uuid"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { shortenAddress } from "utils"
import { ICON_NAMES } from "consts/icon-names"
import usersImageUrl from "assets/images/users.svg"
import { GovPoolProfileTabsContext } from "context/govPool/GovPoolProfileTabsContext/GovPoolProfileTabsContext"
import { GovPoolProfileCommonContext } from "context/govPool/GovPoolProfileCommonContext/GovPoolProfileCommonContext"
import { formatTokenNumber } from "utils"
import { DaoPoolDaoProfileValidatorsQuery } from "queries"

import { FlexLink, Image, TextValue } from "../styled"
import { graphClientDaoValidators } from "utils/graphClient"

interface Props {
  chainId?: number
}

interface IValidator {
  id: string
  balance: string
}

const DaoProfileTabValidators: React.FC<Props> = ({ chainId }) => {
  const { daoAddress } = useParams<"daoAddress">()
  const { validatorsCount, validatorsLoading, validators, setValidators } =
    useContext(GovPoolProfileTabsContext)
  const { validatorsTotalVotes, validatorsToken } = useContext(
    GovPoolProfileCommonContext
  )

  const TableHead = useMemo(
    () => (
      <Flex full ai="center" jc="space-between">
        <TextValue fw={600}>Validators: {validatorsCount}</TextValue>
        <TextValue fw={600}>
          Total votes:{" "}
          {validatorsTotalVotes && validatorsToken
            ? formatTokenNumber(
                validatorsTotalVotes,
                validatorsToken.decimals
              ) +
              " " +
              validatorsToken.symbol
            : "0"}
        </TextValue>
      </Flex>
    ),
    [validatorsCount, validatorsTotalVotes, validatorsToken]
  )

  const TableNoDataPlaceholder = useMemo(
    () => (
      <Flex full dir="column" ai="center" jc="center">
        <Image src={usersImageUrl} alt="No data" />
        <TextValue align="center" lh="19.5px" fw={500}>
          В этом ДАО нет валидаторов, но вы можете добавить их создав пропозал
          для валидаторов
        </TextValue>
      </Flex>
    ),
    []
  )

  const getTableRow = useCallback(
    ({ id, balance }: IValidator) => (
      <>
        {validatorsToken && (
          <FlexLink
            full
            as={"a"}
            key={uuidv4()}
            href={getExplorerLink(
              chainId ?? 0,
              id.substring(0, 42),
              ExplorerDataType.ADDRESS
            )}
          >
            <Flex full ai="center" jc="space-between">
              <TextValue color={theme.textColors.secondary} block>
                <Flex ai="center" jc="flex-start" gap="4">
                  {shortenAddress(id.substring(0, 42), 4)}
                  <Icon name={ICON_NAMES.externalLink} />
                </Flex>
              </TextValue>

              <Flex ai="center" jc="flex-end" gap="4">
                <TextValue>
                  {formatTokenNumber(
                    BigNumber.from(balance),
                    validatorsToken.decimals
                  )}
                </TextValue>
                <TextValue color={theme.textColors.secondary}>
                  {validatorsToken.symbol}
                </TextValue>
              </Flex>
            </Flex>
          </FlexLink>
        )}
      </>
    ),
    [chainId, validatorsToken]
  )

  if (validatorsLoading) {
    return <TabFallback />
  }

  return (
    <Card>
      {validatorsCount !== null && (
        <>
          {validatorsCount === 0 && TableNoDataPlaceholder}
          {validatorsCount !== 0 && (
            <PaginationTable<IValidator>
              total={validatorsCount}
              limit={5}
              data={validators}
              setData={setValidators}
              row={getTableRow}
              nodeHead={TableHead}
              query={DaoPoolDaoProfileValidatorsQuery}
              context={graphClientDaoValidators}
              variables={{ address: daoAddress }}
              formatter={(d) => d.daoPool.validators}
            />
          )}
        </>
      )}
    </Card>
  )
}

export default DaoProfileTabValidators
