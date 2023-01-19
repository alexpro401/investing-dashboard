import styled from "styled-components/macro"
import { v4 as uuidv4 } from "uuid"

import { PoolType } from "consts/types"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"

import { Flex, To, Text, getAmountColor } from "theme"
import TokenIcon from "components/TokenIcon"
import Icon from "components/Icon"
import { AppButton, Icon as CommonIcon } from "common"
import AccountInfo from "components/AccountInfo"
import { useAddToast } from "state/application/hooks"
import { useCallback } from "react"
import { copyToClipboard } from "utils/clipboard"
import { shortenAddress } from "utils"
import { ICON_NAMES } from "consts/icon-names"
import { isNil } from "lodash"
import dexe from "assets/icons/dexe-dark.svg"
import { generatePath } from "react-router-dom"
import { ROUTE_PATHS } from "consts"

export const Scroll = styled.div`
  padding: 16px 0;
  position: relative;
  max-height: 393px;
  overflow-y: auto;
`

export const Account = {
  Container: styled.div`
    background: #141926;
    border-radius: 24px;
    padding: 11px 15px;
    margin: 0 16px 16px;
  `,
  RightNode: styled(AppButton)`
    padding: 0;
  `,
}

export const AccountCard: React.FC<{
  account?: string | null
}> = ({ account }) => {
  const addToast = useAddToast()

  const copyAccountToClipboard = useCallback(async () => {
    if (!isNil(account)) {
      await copyToClipboard(account)
      const _toast = {
        type: "success",
        content: "Address copied to clipboard.",
      }
      addToast(_toast, uuidv4(), 3000)
    }
  }, [account, addToast])

  return (
    <Account.Container>
      <Flex full ai="center" jc="space-between">
        <div onClick={copyAccountToClipboard}>
          <AccountInfo account={account}>
            <Flex ai="center" jc="flex-start" gap="3" m="2px 0 0">
              <Text color="#B1C7FC" fz={13} lh="15px">
                {shortenAddress(account, 2)}
              </Text>
              <CommonIcon name={ICON_NAMES.copy} color="#B1C7FC" />
            </Flex>
          </AccountInfo>
        </div>
        <Account.RightNode
          color="default"
          size="small"
          text="Open trader profile"
          routePath="/me/trader"
        />
      </Flex>
    </Account.Container>
  )
}

export const Divider = styled.div`
  background: radial-gradient(
      54.8% 53% at 50% 50%,
      #587eb7 0%,
      rgba(88, 126, 183, 0) 100%
    ),
    radial-gradient(
      60% 51.57% at 50% 50%,
      #6d99db 0%,
      rgba(109, 153, 219, 0) 100%
    ),
    radial-gradient(
      69.43% 69.43% at 50% 50%,
      rgba(5, 5, 5, 0.5) 0%,
      rgba(82, 82, 82, 0) 100%
    );
  opacity: 0.1;
  width: fill-available;
  margin-left: 63px;
  height: 1px;
`

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 25% 15%;
  align-items: center;
`

export const List = {
  Container: styled.div`
    width: 100%;

    &:not(:first-child) {
      margin-top: 20px;
    }
  `,
  Head: styled(Row)`
    padding: 0 16px 16px;
  `,
  Body: styled.div`
    padding: 0 16px 24px;

    & > * {
      display: block;
      &:not(:nth-child(1)) {
        margin-top: 24px;
      }
    }
  `,
  Placeholder: styled(Flex).attrs(() => ({
    full: true,
    ai: "center",
    jc: "flex-start",
    gap: "8",
  }))`
    font-family: ${(props) => props.theme.appFontFamily};
    font-size: 13px;
    line-height: 150%;
    color: ${({ theme }) => theme.textColors.secondary};
    height: 60px;
  `,
  PlaceholderIcon: styled.img`
    height: 38px;
    width: 38px;
  `,
}

export const ListHead = ({ title, showLabels = true }) => (
  <List.Head>
    <Text block color="#E4F2FF">
      {title}
    </Text>
    {showLabels && (
      <>
        <Text block color="#B1C7FC">
          TVL
        </Text>
        <Text block color="#B1C7FC" align="right">
          P&L
        </Text>
      </>
    )}
  </List.Head>
)
export const ListPlaceholder = ({ title }) => (
  <div>
    <List.Placeholder>
      <List.PlaceholderIcon src={dexe} />
      {title}
    </List.Placeholder>
  </div>
)

export const ButtonContainer = styled(Flex).attrs(() => ({
  full: true,
  m: "16px",
}))`
  & > * {
    flex: 0 1 calc(100% - 32px);
  }
`

const PoolIcons = styled.div`
  width: 38px;
  height: 38px;
  position: relative;
  margin-right: 9px;
`

const BaseWrapper = styled.div`
  width: 20px;
  height: 20px;
  position: absolute;
  right: -5px;
  bottom: 0;
`

export const PoolCard: React.FC<{
  baseAddress: string
  symbol: string
  name: string
  tvl: string
  pnl: string
  address: string
  descriptionURL: string
  poolType: PoolType
  onClick: () => void
}> = ({
  symbol,
  name,
  tvl,
  pnl,
  address,
  baseAddress,
  descriptionURL,
  onClick,
}) => {
  const [{ poolMetadata }] = usePoolMetadata(address, descriptionURL)
  return (
    <To
      onClick={onClick}
      to={generatePath(ROUTE_PATHS.poolProfile, {
        poolAddress: address,
        "*": "",
      })}
    >
      <Row>
        <Flex jc="flex-start">
          <PoolIcons>
            <Icon
              m="0"
              size={34}
              source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
              address={address}
            />
            <BaseWrapper>
              <TokenIcon size={20} address={baseAddress} m="0" />
            </BaseWrapper>
          </PoolIcons>
          <Flex dir="column" ai="flex-start">
            <Text color="#E4F2FF" fw={700} fz={16} lh="19px">
              {symbol}
            </Text>
            <Text color="#B1C7FC" fz={13} lh="15px" p="2px 0 0">
              {name}
            </Text>
          </Flex>
        </Flex>
        <Text color="#E4F2FF" fw={600} lh="17px">
          {tvl}
        </Text>
        <Text color={getAmountColor(pnl)} fw={600} lh="17px" align="right">
          {Number(pnl) <= 0 ? `${pnl}%` : `+${pnl}%`}
        </Text>
      </Row>
    </To>
  )
}
