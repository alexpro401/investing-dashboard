import {
  FC,
  HTMLAttributes,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import Tooltip from "components/Tooltip"
import { PoolProfileContext } from "../../context"
import JazzIcon from "components/Icon/JazzIcon"

import * as S from "./styled"

import { v4 as uuidv4 } from "uuid"
import { shortenAddress } from "utils"
import { usePoolMetadata, useUserMetadata } from "state/ipfsMetadata/hooks"
import { useEffectOnce } from "react-use"
import { useOwnedPools } from "state/pools/hooks"
import { useTranslation } from "react-i18next"
import { generatePath } from "react-router-dom"
import { ROUTE_PATHS } from "consts"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const PoolAvatar = ({ poolAddress, descriptionUrl, ...rest }) => {
  const [{ poolMetadata }] = usePoolMetadata(poolAddress, descriptionUrl)

  const avatarUrl = useMemo(
    () => poolMetadata?.assets[poolMetadata?.assets?.length - 1],
    [poolMetadata]
  )

  return avatarUrl ? (
    <S.TraderPoolsListBadgePoolImage src={avatarUrl} {...rest} />
  ) : (
    <JazzIcon address={poolAddress} />
  )
}

const TraderPoolsList: FC<Props> = ({ ...rest }) => {
  const { fundAddress, traderInfo } = useContext(PoolProfileContext)

  const { t } = useTranslation()

  const [{ userName, userAvatar }, { fetchUserMetadata }] = useUserMetadata(
    traderInfo?.address
  )

  const [ownedPools] = useOwnedPools(traderInfo?.address)

  useEffectOnce(() => {
    fetchUserMetadata(false)
  })

  return (
    <S.Root {...rest}>
      <S.TraderPoolsListBadge>
        <S.TraderPoolsListBadgeAccountWrp>
          {userAvatar ? (
            <S.TraderPoolsListBadgeAccountImage
              src={userAvatar}
              alt={String(userName)}
            />
          ) : (
            <JazzIcon address={userName || traderInfo?.address || ""} />
          )}
          <S.TraderPoolsListBadgeAccountAddress>
            {userName || shortenAddress(traderInfo?.address) || ""}
          </S.TraderPoolsListBadgeAccountAddress>
        </S.TraderPoolsListBadgeAccountWrp>
        {ownedPools?.map((el, idx) => (
          <S.TraderPoolsListBadgePoolWrp
            key={idx}
            isActive={fundAddress === el.id}
            to={generatePath(ROUTE_PATHS.poolProfile, {
              poolAddress: el.id,
              "*": "",
            })}
          >
            <PoolAvatar
              poolAddress={el.id}
              descriptionUrl={el.descriptionURL}
            />
            <S.TraderPoolsListBadgePoolTick>
              {el?.ticker}
            </S.TraderPoolsListBadgePoolTick>
          </S.TraderPoolsListBadgePoolWrp>
        )) || <></>}
      </S.TraderPoolsListBadge>
      <Tooltip id={uuidv4()}>{t("trader-pools-list.tooltip-msg")}</Tooltip>
    </S.Root>
  )
}

export default TraderPoolsList
