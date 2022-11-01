import Button from "components/Button"
import ExchangeInput from "components/Exchange/ExchangeInput"
import NftInput from "components/Exchange/NftInput"
import * as S from "components/Exchange/styled"
import { ZERO } from "constants/index"
import useGovPoolTokensInfo from "hooks/useGovPoolTokensInfo"
import { FC, useMemo } from "react"
import { Flex } from "theme"

interface Props {
  daoPoolAddress?: string
}

const ProposalVotingTerminal: FC<Props> = ({ daoPoolAddress }) => {
  const [govTokens, nftInfo] = useGovPoolTokensInfo(daoPoolAddress)

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
        <S.Title active>Swap</S.Title>
      </S.CardHeader>

      <ExchangeInput
        price={ZERO}
        amount={ZERO.toString()}
        balance={ZERO}
        address={govTokens.tokenAddress}
        symbol={""}
        decimal={18}
        onChange={() => {}}
      />

      <NftInput price={ZERO} balance={ZERO} address={govTokens.nftAddress} />

      <Flex p="16px 0 0" full>
        {button}
      </Flex>
    </S.Card>
  )
}

export default ProposalVotingTerminal
