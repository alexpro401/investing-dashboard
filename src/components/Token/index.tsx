import { Flex } from "theme"
import { InfoRow, InfoGrey, InfoWhite } from "components/Exchange/styled"
import TokenIcon from "components/TokenIcon"
import { cutDecimalPlaces, normalizeBigNumber } from "utils"
import { FC } from "react"
import { BigNumberish } from "@ethersproject/bignumber"
import { useERC20Data } from "state/erc20/hooks"

interface Props {
  data: {
    address: string
    amount: BigNumberish
  }
}

const Token: FC<Props> = ({ data }) => {
  const [tokenData] = useERC20Data(data.address)

  return (
    <InfoRow>
      <Flex>
        <TokenIcon address={data.address} size={15} />
        <InfoGrey>{tokenData?.name}</InfoGrey>
      </Flex>
      <Flex gap="4">
        <InfoWhite>
          {normalizeBigNumber(cutDecimalPlaces(data?.amount))}
        </InfoWhite>
        <InfoGrey>{tokenData?.symbol}</InfoGrey>
      </Flex>
    </InfoRow>
  )
}

export default Token
