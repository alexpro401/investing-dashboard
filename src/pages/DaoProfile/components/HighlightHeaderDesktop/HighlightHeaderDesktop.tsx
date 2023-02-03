import React, { useContext, useMemo } from "react"
import { isNil } from "lodash"
import { v4 as uuidv4 } from "uuid"

import { useActiveWeb3React } from "hooks"

import { Icon } from "common"
import ExternalLink from "components/ExternalLink"
import { GovPoolProfileCommonContext } from "context/govPool/GovPoolProfileCommonContext/GovPoolProfileCommonContext"
import { isAddress } from "utils"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { ICON_NAMES } from "consts"

import * as S from "./styled"

const HighlightHeaderDesktop: React.FC = () => {
  const {
    descriptionObject,
    govPoolQuery,
    haveToken,
    haveNft,
    nftName,
    nftAddress,
    mainToken,
  } = useContext(GovPoolProfileCommonContext)
  const { chainId } = useActiveWeb3React()

  const daoPoolQueryInfo = useMemo(() => {
    return govPoolQuery?.data?.daoPool ?? undefined
  }, [govPoolQuery])

  const govPoolName = useMemo(() => {
    if (!descriptionObject) return daoPoolQueryInfo?.name ?? "DAO"

    return descriptionObject.daoName
  }, [descriptionObject, daoPoolQueryInfo])

  const tokenExplorerLink = React.useMemo(() => {
    if (
      isNil(chainId) ||
      !haveToken ||
      !mainToken ||
      !isAddress(mainToken.address)
    )
      return ""

    return getExplorerLink(chainId, mainToken.address, ExplorerDataType.TOKEN)
  }, [chainId, haveToken, mainToken])

  const nftExplorerLink = React.useMemo(() => {
    if (isNil(chainId) || !haveNft || !isAddress(nftAddress)) return ""

    return getExplorerLink(chainId, nftAddress, ExplorerDataType.ADDRESS)
  }, [chainId, haveNft, nftAddress])

  if (descriptionObject === undefined) return null

  return (
    <S.HeaderWrp>
      <S.IconProfile
        size={100}
        m="0 8px 0 0"
        address={daoPoolQueryInfo?.id}
        source={descriptionObject?.avatarUrl ?? ""}
      />
      <S.HeaderMain>
        <S.Title>{govPoolName}</S.Title>
        <S.TitleLinks>
          {haveToken && mainToken && (
            <S.TitleLink
              href={tokenExplorerLink}
              target="_blank"
              rel="noreferrer"
            >
              {mainToken.symbol} token
            </S.TitleLink>
          )}
          {haveNft && nftName !== "" && (
            <S.TitleLink
              href={nftExplorerLink}
              target="_blank"
              rel="noreferrer"
            >
              {nftName}
            </S.TitleLink>
          )}
        </S.TitleLinks>
      </S.HeaderMain>
      {descriptionObject && descriptionObject?.socialLinks.length !== 0 && (
        <S.HeaderLinks>
          {descriptionObject.socialLinks
            .slice(0, 5)
            .filter((el) => !!el[1])
            .map(([tag, url]) => (
              <ExternalLink
                key={uuidv4()}
                href={url}
                color="#788AB4"
                removeIcon
              >
                <Icon name={ICON_NAMES[tag]} />
              </ExternalLink>
            ))}
        </S.HeaderLinks>
      )}
    </S.HeaderWrp>
  )
}

export default HighlightHeaderDesktop
