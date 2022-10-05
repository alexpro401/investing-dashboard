import { isNil } from "lodash"
import { FC, ReactNode, useCallback, useMemo } from "react"

import { Flex } from "theme"
import { shortenAddress } from "utils"
import { useActiveWeb3React } from "hooks"
import { ICON_NAMES } from "constants/icon-names"
import { InsuranceAccident } from "interfaces/insurance"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"

import * as S from "./styled"
import { AppButton } from "common"
import VoteProgress from "components/VoteProgress"

interface Props {
  nodeHead?: ReactNode
  payload: InsuranceAccident
  shorten?: boolean
}

const VotingCard: FC<Props> = ({ nodeHead, payload, shorten = false }) => {
  const { chainId } = useActiveWeb3React()
  const { creator } = payload

  const creatorURL = useMemo(() => {
    if (!creator || isNil(chainId)) {
      return ""
    }

    return getExplorerLink(chainId, creator, ExplorerDataType.ADDRESS)
  }, [creator, chainId])

  const votingCount = useMemo(() => {
    return 200
  }, [])

  const votingMaxCount = useMemo(() => {
    return "1.111"
  }, [])

  const votingType = useMemo(() => {
    return "Insurance proposal"
  }, [])

  const addressesVoted = useMemo(() => {
    return 20
  }, [])

  const endDate = useMemo(() => {
    return "2D : 22H : 23M"
  }, [])

  const onVote = useCallback(() => {
    console.log("Handle Vote")
  }, [])

  return (
    <S.Container>
      {nodeHead ? <S.Head>{nodeHead}</S.Head> : <></>}
      <S.Body>
        {shorten && (
          <>
            <Flex full m="0 0 16px">
              <VoteProgress up={30} down={10} />
            </Flex>
          </>
        )}

        <Flex full ai="center" jc="space-between">
          <Flex dir="column" gap="4" ai="flex-start">
            <S.Value>
              <AppButton
                text={shortenAddress(creator)}
                href={creatorURL}
                iconRight={ICON_NAMES.externalLink}
                size="no-paddings"
                color="default"
                target="_blank"
              />
            </S.Value>
            <S.Title>Сreated by</S.Title>
          </Flex>
          <Flex dir="column" gap="4" ai="flex-end">
            <S.Value>
              {votingCount}/<span>{votingMaxCount}</span>
            </S.Value>
            <S.Title>Voting status</S.Title>
          </Flex>
        </Flex>
        {!shorten && (
          <>
            <VoteProgress up={30} down={10} />
            <Flex full ai="center" jc="space-between" p="16px">
              <Flex dir="column" gap="4" ai="flex-start">
                <S.Value>{votingType}</S.Value>
                <S.Title>Voting type</S.Title>
              </Flex>
              <Flex dir="column" gap="4" ai="flex-end">
                <S.Value>{addressesVoted}</S.Value>
                <S.Title>Addresses voted</S.Title>
              </Flex>
            </Flex>
          </>
        )}
        <Flex full m="16px 0 0">
          <S.VoteButton
            text={`Voting ends for ${endDate}`}
            size="medium"
            onClick={onVote}
          />
        </Flex>
      </S.Body>
    </S.Container>
  )
}

export default VotingCard
