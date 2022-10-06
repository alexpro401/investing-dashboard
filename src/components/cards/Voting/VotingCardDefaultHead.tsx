import { FC, useCallback, useMemo } from "react"

import { Flex, Text } from "theme"
import { AppButton } from "common"
import { useNavigate } from "react-router-dom"

interface Props {
  payload: any
}

const VotingCardDefaultHead: FC<Props> = ({ payload }) => {
  const navigate = useNavigate()

  const voteType = useMemo(() => {
    if (!payload) return
    return payload.type ?? "Uniswap contract"
  }, [payload])

  const onRedirect = useCallback(() => {
    if (!payload) return
    navigate("/")
  }, [payload])
  return (
    <>
      <Flex full ai="center" jc="space-between">
        <Text>{voteType}</Text>
        <AppButton onClick={onRedirect} />
      </Flex>
    </>
  )
}

export default VotingCardDefaultHead
