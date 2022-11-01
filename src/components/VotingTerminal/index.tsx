import Button from "components/Button"
import ExchangeInput from "components/Exchange/ExchangeInput"
import NftInput from "components/Exchange/NftInput"
import * as S from "components/Exchange/styled"
import { ZERO } from "constants/index"
import { FC, useMemo } from "react"
import { Flex } from "theme"
import useVotingTerminal from "./useVotingTerminal"

interface Props {
  daoPoolAddress?: string
}

const VotingTerminal: FC<Props> = ({ daoPoolAddress }) => {
  const formInfo = useVotingTerminal(daoPoolAddress)

  const button = useMemo(() => {
    return (
      <Button size="large" theme="primary" onClick={() => {}} fz={22} full>
        Confirm voting & Create proposal
      </Button>
    )
  }, [])

  return (
    <S.Card>
      <S.CardHeader>
        <S.Title active>Vote to create</S.Title>
      </S.CardHeader>

      <ExchangeInput
        price={ZERO}
        amount={ZERO.toString()}
        balance={formInfo.erc20.balance}
        address={formInfo.erc20.address}
        symbol={formInfo.erc20.symbol}
        decimal={formInfo.erc20.decimal}
        onChange={() => {}}
      />

      <NftInput
        price={ZERO}
        balance={formInfo.erc721.balance}
        address={formInfo.erc721.address}
      />

      <Flex p="16px 0 0" full>
        {button}
      </Flex>
    </S.Card>
  )
}

export default VotingTerminal
