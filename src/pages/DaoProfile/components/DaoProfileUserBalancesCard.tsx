import { FC, useCallback, useState, useMemo } from "react"
import { v4 as uuidv4 } from "uuid"

import theme, { Flex } from "theme"
import { Card, Collapse, Icon } from "common"
import { Indents, TextLabel, TextValue } from "../styled"

import { AppButton } from "common"
import Tooltip from "components/Tooltip"
import ProgressLine from "components/ProgressLine"
import { ICON_NAMES } from "constants/icon-names"
import ERC721Row from "components/ERC721Row"
import { ZERO } from "constants/index"

import { useGovPoolVotingAssets, useGovPoolWithdrawableAssets } from "hooks/dao"
import { useActiveWeb3React } from "hooks"
import {
  useERC20GovBalance,
  useERC721GovBalance,
} from "hooks/dao/useGovPoolMemberBalance"
import { formatTokenNumber } from "utils"
import { divideBignumbers } from "utils/formulas"
import { formatUnits, parseEther } from "@ethersproject/units"
import { isNaN } from "lodash"

interface Props {
  daoPoolAddress?: string
}

const DaoProfileUserBalancesCard: FC<Props> = ({ daoPoolAddress }) => {
  const [showNftList, setShowNftList] = useState(false)

  const { account } = useActiveWeb3React()

  const [{ haveNft, haveToken }, { token }] =
    useGovPoolVotingAssets(daoPoolAddress)

  const withdrawableAssets = useGovPoolWithdrawableAssets({
    daoPoolAddress,
    delegator: account,
  })

  const erc20Balances = useERC20GovBalance(daoPoolAddress)
  const erc721Balances = useERC721GovBalance(daoPoolAddress)

  const erc20 = useMemo(() => {
    const total = erc20Balances.poolBalance
    const available = withdrawableAssets?.tokens || ZERO
    const used = !total.isZero() ? total.sub(available) : ZERO

    return {
      total: total,
      used: used,
      available: available,
    }
  }, [erc20Balances.poolBalance, withdrawableAssets])

  const erc721 = useMemo(() => {
    const total = erc721Balances.poolBalance
    const available = withdrawableAssets?.nfts[0].map((v) => v.toNumber()) || []
    const used = total.filter((item) => !available.includes(item))

    return {
      total: total,
      used: used,
      available: available,
    }
  }, [erc721Balances.poolBalance, withdrawableAssets])

  const progressBarValue = useMemo(() => {
    const tokenDenumerator = divideBignumbers(
      [erc20.total, token?.decimals || 18],
      [parseEther("100"), 18]
    )

    const tokenScore = divideBignumbers(
      [erc20.used, token?.decimals || 18],
      [tokenDenumerator, token?.decimals || 18]
    )

    const nftDenumerator = erc721.total.length / 100

    const nftScore = erc721.used.length / nftDenumerator

    const percent =
      Number(formatUnits(tokenScore, token?.decimals || 18)) + nftScore

    return isNaN(percent) || percent < 0 ? 0 : Number((percent / 2).toFixed(0))
  }, [erc20.total, erc20.used, erc721.total.length, erc721.used.length, token])

  const toggleNftList = useCallback(() => {
    if (haveNft && !!erc721.total.length) {
      setShowNftList((prev) => !prev)
    }
  }, [erc721.total.length, haveNft])

  return (
    <Card>
      {haveToken && (
        <Flex full ai="center" jc="space-between">
          <Flex dir="column" ai="flex-start" gap="4">
            <Flex ai="center" jc="flex-start" gap="4">
              <TextValue fw={600}>
                {formatTokenNumber(erc20.total, 18, 2)} /
              </TextValue>
              <TextValue fw={600} color={theme.textColors.secondary}>
                {formatTokenNumber(erc20.used, 18, 2)} {token?.symbol}
              </TextValue>
            </Flex>
            <Flex ai="center" gap="4">
              <Tooltip id={uuidv4()}>Total balance/used in voting</Tooltip>
              <TextLabel fw={500}>Total balance/used in voting</TextLabel>
            </Flex>
          </Flex>
          <Flex dir="column" ai="flex-end" gap="4">
            <TextValue fw={600} color={theme.statusColors.success}>
              {formatTokenNumber(erc20.available, 18, 2)}
            </TextValue>
            <TextLabel fw={500}>Available</TextLabel>
          </Flex>
        </Flex>
      )}
      <ProgressLine w={progressBarValue} />
      {haveNft && (
        <div>
          <Flex full ai="center" jc="space-between" onClick={toggleNftList}>
            <Flex dir="column" ai="flex-start" gap="4">
              <Flex ai="center" jc="flex-start" gap="4">
                <TextValue fw={600}>{erc721.total.length} /</TextValue>
                <TextValue fw={600} color={theme.textColors.secondary}>
                  {erc721.used.length} NFT
                </TextValue>
                <Icon
                  name={ICON_NAMES[showNftList ? "angleUp" : "angleDown"]}
                  color={theme.textColors.secondary}
                />
              </Flex>
              <Flex>
                <TextLabel fw={500}>Total balance/used in voting</TextLabel>
              </Flex>
            </Flex>
            <Flex dir="column" ai="flex-end" gap="4">
              <TextValue fw={600} color={theme.statusColors.success}>
                {erc721.available.length}
              </TextValue>
              <TextLabel fw={500}>Available</TextLabel>
            </Flex>
          </Flex>
          <Collapse isOpen={showNftList} duration={0.3}>
            {erc721.total.map((nft) => (
              <Indents top side={false} key={nft}>
                <ERC721Row
                  votingPower={ZERO}
                  tokenId={nft.toString()}
                  // TODO: replace with real nft images
                  tokenUri="https://public.nftstatic.com/static/nft/res/nft-cex/S3/1664823519694_jkjs8973ujyphjznjmmjd5h88tay9e0x.png"
                />
              </Indents>
            ))}
          </Collapse>
        </div>
      )}
      <AppButton
        full
        color="secondary"
        size="small"
        onClick={() => alert("Redirect to 'withdraw DAO tokens' terminal 🤑")}
        text="Withdraw available assets"
      />
    </Card>
  )
}

export default DaoProfileUserBalancesCard
