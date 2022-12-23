import { FC } from "react"
import { map } from "lodash"
import styled from "styled-components/macro"

import { Flex, Text } from "theme"
import Icon from "components/Icon"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { IPoolQuery } from "interfaces/thegraphs/all-pools"

export const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  grid-gap: 16px;
  width: 100%;
`
export const StatisticValue = styled(Text).attrs(() => ({
  color: "#f7f7f7",
  fw: 600,
  fs: 16,
  lh: "16px",
}))``

const PoolIconsList = styled(Flex).attrs(() => ({
  ai: "center",
  jc: "flex-end",
}))`
  & > img {
    border: 0;
  }
`

const PoolIcon: FC<{ id: string; ipfs: string }> = ({ id, ipfs }) => {
  const [{ poolMetadata: meta }] = usePoolMetadata(id, ipfs)

  return (
    <Icon
      size={26}
      m="0 0 0 -10px"
      source={meta?.assets[meta?.assets.length - 1]}
      address={id}
    />
  )
}

const Count = {
  Container: styled(Flex)`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 26px;
    height: 26px;
    margin: 0 0 0 -10px;
    padding: 0 4px 0 2px;
    border-radius: 13px;
    background: #181e2c;
    border: 1px solid #293c54;
  `,
  Content: styled(Text).attrs(() => ({
    color: "#e4f2ff",
    fw: 600,
    fz: 12,
    lh: "14px",
    align: "center",
  }))``,
}

export const PoolsIcons: FC<{ pools: IPoolQuery[] }> = ({ pools }) => {
  const count = 8
  return (
    <PoolIconsList>
      {map(pools.slice(0, count), (pool) => (
        <PoolIcon id={pool.id} ipfs={pool.descriptionURL} key={pool.id} />
      ))}
      {pools.length > count ? (
        <Count.Container>
          <Count.Content>{pools.length - count}</Count.Content>
        </Count.Container>
      ) : null}
    </PoolIconsList>
  )
}
