import * as React from "react"
import { format } from "date-fns"
import { isNil, map } from "lodash"
import { BigNumber } from "@ethersproject/bignumber"

import * as S from "./styled"
import theme, { Flex } from "theme"
import { Icon, Collapse } from "common"

import { Token } from "interfaces"
import { ZERO } from "constants/index"
import { DATE_FORMAT } from "constants/time"
import { ICON_NAMES } from "constants/icon-names"
import ExternalLink from "components/ExternalLink"
import { expandTimestamp, formatBigNumber, shortenAddress } from "utils"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { IGovPoolDelegationHistoryQuery } from "interfaces/thegraphs/gov-pools"

interface GovDelegateeCardProps {
  data: IGovPoolDelegationHistoryQuery
  chainId?: number

  token: Token | null
}

const GovDelegateeCard: React.FC<GovDelegateeCardProps> = ({
  data,
  chainId,
  token,
}) => {
  const [open, setOpen] = React.useState(false)

  const _valueColor = React.useMemo(
    () =>
      data.isDelegate ? theme.statusColors.success : theme.statusColors.error,
    [data]
  )

  const senderExplorerLink = React.useMemo(() => {
    if (isNil(chainId) || isNil(data)) return ""
    return getExplorerLink(chainId, data.from.id, ExplorerDataType.ADDRESS)
  }, [chainId, data])

  const tokenAmount = React.useMemo(
    () => BigNumber.from(data.amount) ?? ZERO,
    [data]
  )

  return (
    <S.Root onClick={() => setOpen((p) => !p)}>
      <S.GovDelegateeCardContent>
        <Flex full>
          <Flex ai={"center"} jc={"flex-start"} gap={"8"}>
            <Icon
              name={ICON_NAMES.arrow}
              color={
                data.isDelegate
                  ? theme.statusColors.success
                  : theme.statusColors.error
              }
              dir={data.isDelegate ? "bottom-left" : "top-right"}
            />
            <ExternalLink
              fz="13px"
              fw="500"
              color={theme.textColors.primary}
              href={senderExplorerLink}
            >
              {shortenAddress(data.from.id, 3)}
            </ExternalLink>
          </Flex>

          <Flex ai={"center"} jc={"flex-end"} gap={"8"}>
            <S.GovDelegateeCardLabel>
              {format(expandTimestamp(Number(data.timestamp)), DATE_FORMAT)}
            </S.GovDelegateeCardLabel>
            <Icon
              name={open ? ICON_NAMES.angleUp : ICON_NAMES.angleDown}
              color={theme.textColors.secondary}
            />
          </Flex>
        </Flex>
        <Collapse isOpen={open}>
          <Flex full dir={"column"} gap={"16"}>
            <S.GovDelegateeCardDivider />
            {!tokenAmount.isZero() && (
              <Flex full ai={"flex-start"} jc={"space-between"}>
                <S.GovDelegateeCardLabel>
                  Token received
                </S.GovDelegateeCardLabel>
                <S.GovDelegateeCardValue color={_valueColor}>
                  {data.isDelegate ? "+" : "-"}{" "}
                  {formatBigNumber(BigNumber.from(data.amount), 18, 2)}{" "}
                  {token?.symbol}
                </S.GovDelegateeCardValue>
              </Flex>
            )}
            {data.nfts.length > 0 && (
              <Flex full ai={"flex-start"} jc={"space-between"}>
                <S.GovDelegateeCardLabel>NFT received</S.GovDelegateeCardLabel>
                <S.GovDelegateeCardValueNfts color={_valueColor}>
                  {map(data.nfts, (nftId, index) => (
                    <span key={nftId}>
                      <>{index > 0 && ","}</>
                      &nbsp;
                      <>#{nftId}</>
                    </span>
                  ))}
                </S.GovDelegateeCardValueNfts>
              </Flex>
            )}
          </Flex>
        </Collapse>
      </S.GovDelegateeCardContent>
    </S.Root>
  )
}

export default GovDelegateeCard
