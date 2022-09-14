import { Flex } from "theme"
import S, { ProgressBar } from "./styled"
import usePoolLockedFunds from "hooks/usePoolLockedFunds"

interface Props {
  address: string | undefined
}

const PoolLockedFunds: React.FC<Props> = ({ address }) => {
  const [
    {
      baseSymbol,

      totalPoolUSD,
      traderFundsUSD,
      traderFundsBase,
      investorsFundsUSD,
      investorsFundsBase,
      poolUsedInPositionsUSD,
      poolUsedToTotalPercentage,
    },
  ] = usePoolLockedFunds(address)

  return (
    <>
      <Flex full p="15px 0 0">
        <S.Row>
          <S.Title>Investor funds</S.Title>
          <Flex>
            <S.Value c="#9AE2CB">${investorsFundsUSD}</S.Value>&nbsp;
            <S.Value c="#788AB4">
              {investorsFundsBase} {baseSymbol}
            </S.Value>
          </Flex>
        </S.Row>
      </Flex>
      <S.Row>
        <S.Title>Traders funds</S.Title>
        <Flex>
          <S.Value>${traderFundsUSD}</S.Value>&nbsp;
          <S.Value c="#788AB4">
            {traderFundsBase} {baseSymbol}
          </S.Value>
        </Flex>
      </S.Row>
      <S.Row>
        <Flex full dir="column">
          <Flex full m="0 0 8px 0">
            <S.Title>Fund used ({poolUsedToTotalPercentage}%)</S.Title>
            <Flex>
              <S.Value>${poolUsedInPositionsUSD.format}&nbsp;/&nbsp;</S.Value>
              <S.Value c="#788AB4"> ${totalPoolUSD.format}</S.Value>
            </Flex>
          </Flex>
          <ProgressBar w={Number(poolUsedToTotalPercentage)} />
        </Flex>
      </S.Row>
    </>
  )
}

export default PoolLockedFunds
