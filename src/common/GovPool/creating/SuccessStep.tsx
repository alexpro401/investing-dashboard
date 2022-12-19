import { FC, HTMLAttributes, useContext, useMemo } from "react"

import * as S from "./styled"
import { GovPoolFormContext } from "context/govPool/GovPoolFormContext"
import { ICON_NAMES } from "constants/icon-names"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { useActiveWeb3React } from "hooks"
import { shortenAddress } from "utils"
import { useWindowSize } from "react-use"
import { SuccessSubmitBtn, SuccessSubmitBtnWrp } from "./styled"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const SuccessStep: FC<Props> = () => {
  const { chainId } = useActiveWeb3React()

  const { avatarUrl, daoName, createdDaoAddress, clearFormStorage } =
    useContext(GovPoolFormContext)

  const { width: windowWidth } = useWindowSize()
  const isMobile = useMemo(() => windowWidth < 768, [windowWidth])

  return (
    <S.SuccessBackdrop className={"success-backdrop"}>
      <S.SuccessAvatarWrp>
        <S.SuccessAvatar src={avatarUrl.get} />
      </S.SuccessAvatarWrp>
      <S.SuccessTitle>{daoName.get}</S.SuccessTitle>
      <S.SuccessSubtitle
        href={
          chainId
            ? getExplorerLink(
                chainId,
                createdDaoAddress.get,
                ExplorerDataType.ADDRESS
              )
            : ""
        }
        iconColor="#788AB4"
      >
        {shortenAddress(createdDaoAddress.get)}
      </S.SuccessSubtitle>
      <S.SuccessDescription>
        <p>You just successfully created a DAO!</p>
        {isMobile ? <br /> : <></>}
        <p>Now you and other members can govern it via proposals. Congrats!</p>
      </S.SuccessDescription>
      <S.SuccessFooter>
        <S.SuccessLinkBtn
          text="Let the world know"
          color="default"
          size="no-paddings"
        />
        <S.SuccessLinksWrp>
          <S.SuccessLink
            iconRight={ICON_NAMES.telegram}
            size="no-paddings"
            color="default"
            iconSize={isMobile ? 20 : 24}
          />
          <S.SuccessLink
            iconRight={ICON_NAMES.twitter}
            size="no-paddings"
            color="default"
            iconSize={isMobile ? 20 : 24}
          />
          <S.SuccessLink
            iconRight={ICON_NAMES.facebook}
            size="no-paddings"
            color="default"
            iconSize={isMobile ? 20 : 24}
          />
          <S.SuccessLink
            iconRight={ICON_NAMES.linkedin}
            size="no-paddings"
            color="default"
            iconSize={isMobile ? 20 : 24}
          />
          <S.SuccessLink
            iconRight={ICON_NAMES.medium}
            size="no-paddings"
            color="default"
            iconSize={isMobile ? 20 : 24}
          />
        </S.SuccessLinksWrp>
        <S.SuccessSubmitBtnWrp>
          <S.SuccessSubmitBtn
            text="Go to DAO profile"
            size="large"
            color={isMobile ? "primary" : "tertiary"}
            routePath={`/dao/${createdDaoAddress.get}`}
            onClick={clearFormStorage}
          />
        </S.SuccessSubmitBtnWrp>
      </S.SuccessFooter>
    </S.SuccessBackdrop>
  )
}

export default SuccessStep
