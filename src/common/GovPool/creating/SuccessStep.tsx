import { FC, HTMLAttributes, useContext } from "react"

import * as S from "./styled"
import { GovPoolFormContext } from "context/govPool/GovPoolFormContext"
import { ICON_NAMES } from "constants/icon-names"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { useActiveWeb3React } from "hooks"
import { shortenAddress } from "utils"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const SuccessStep: FC<Props> = () => {
  const { chainId } = useActiveWeb3React()

  const { avatarUrl, daoName, createdDaoAddress, clearFormStorage } =
    useContext(GovPoolFormContext)
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
        <br />
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
          />
          <S.SuccessLink
            iconRight={ICON_NAMES.twitter}
            size="no-paddings"
            color="default"
          />
          <S.SuccessLink
            iconRight={ICON_NAMES.facebook}
            size="no-paddings"
            color="default"
          />
          <S.SuccessLink
            iconRight={ICON_NAMES.linkedin}
            size="no-paddings"
            color="default"
          />
          <S.SuccessLink
            iconRight={ICON_NAMES.medium}
            size="no-paddings"
            color="default"
          />
        </S.SuccessLinksWrp>
        <S.SuccessLinkBtn
          text="Go to DAO profile"
          size="large"
          routePath={`/dao/${createdDaoAddress.get}`}
          onClick={clearFormStorage}
        />
      </S.SuccessFooter>
    </S.SuccessBackdrop>
  )
}

export default SuccessStep
