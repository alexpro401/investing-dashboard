import { FC, useMemo } from "react"
import { Flex } from "theme"

import Modal from "components/Modal"
import Token from "components/Token"

import { AppButton } from "common"
import {
  InfoRow,
  InfoGrey,
  InfoDropdown,
  InfoWhite,
} from "components/Exchange/styled"

import Tile from "./Tile"
import useRequestDividend from "./useRequestDividend"
import { IRequestDividendsParams } from "./useRequestDividendsContext"
import * as S from "./styled"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import format from "date-fns/format"
import { DATE_TIME_FORMAT } from "consts/time"

interface Props {
  isOpen: boolean
  onClose: () => void
  params: IRequestDividendsParams
}

const RequestDividend: FC<Props> = ({ isOpen, onClose, params }) => {
  const { token, info, claims, handleSubmit } = useRequestDividend({
    ...params,
    onClose,
  })

  const proposalSize = useMemo(() => {
    return (
      <InfoRow>
        <InfoGrey>Your proposal size:</InfoGrey>
        <Flex gap="4">
          <InfoWhite>{info?.proposalSize.account}</InfoWhite>
          <InfoGrey>
            /{info?.proposalSize.total} {info?.baseSymbol}
          </InfoGrey>
        </Flex>
      </InfoRow>
    )
  }, [info])

  const totalDividends = useMemo(() => {
    return (
      <Flex gap="4">
        <InfoGrey>${info?.totalDividendsUSD}</InfoGrey>
      </Flex>
    )
  }, [info])

  const dividendsList = useMemo(() => {
    if (!info || !info.dividends) return
    return info.dividends.map((dividend) => (
      <Token key={dividend.address} data={dividend} />
    ))
  }, [info])

  const lastWithdrawn = useMemo(() => {
    if (!claims || !claims.length)
      return (
        <Flex gap="4">
          <InfoWhite>-</InfoWhite>
        </Flex>
      )

    return (
      <Flex gap="4">
        <InfoWhite>
          {formatDistanceToNow(new Date(Number(claims[0].timestamp) * 1000))}{" "}
          ago
        </InfoWhite>
      </Flex>
    )
  }, [claims])

  const withdrawsList = useMemo(() => {
    if (!claims) return

    return claims.map((claim) => (
      <InfoRow key={claim.id}>
        <InfoWhite>
          {format(
            new Date(Number(claims[0].timestamp) * 1000),
            DATE_TIME_FORMAT
          )}
        </InfoWhite>
        <Flex gap="4">
          <InfoWhite>{claim.dividendsTokens.length}</InfoWhite>
          <InfoGrey>token{claim.dividendsTokens.length > 1 && "s"}</InfoGrey>
        </Flex>
      </InfoRow>
    ))
  }, [claims])

  return (
    <Modal isOpen={isOpen} toggle={onClose} title="Request a dividend">
      <Tile
        poolAddress={params.poolAddress}
        proposalId={params.proposalId}
        token={token}
      />

      <S.Body>
        {proposalSize}
        <InfoDropdown
          left={<InfoGrey>Dividends to withdraw: </InfoGrey>}
          right={totalDividends}
        >
          {dividendsList}
        </InfoDropdown>
        <InfoDropdown
          left={<InfoGrey>Last withdraw</InfoGrey>}
          right={lastWithdrawn}
        >
          {withdrawsList}
        </InfoDropdown>
        <AppButton
          size="medium"
          color="primary"
          onClick={handleSubmit}
          full
          text="Confirm withdraw"
        />
      </S.Body>
    </Modal>
  )
}

export default RequestDividend
