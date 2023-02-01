import React, { useContext } from "react"

import { CreateFundContext } from "context/fund/CreateFundContext"
import { useActiveWeb3React, useBreakpoints } from "hooks"
import { ICON_NAMES, ROUTE_PATHS } from "consts"
import { shortenAddress } from "utils"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import theme, { Flex } from "theme"

import * as S from "./styled"
import defaultAvatar from "assets/icons/default-avatar.svg"
import { generatePath } from "react-router-dom"

interface ISuccessModalProps {
  createdFundAddress: string
  close: () => void
}

const SuccessModal: React.FC<ISuccessModalProps> = ({
  createdFundAddress,
  close,
}) => {
  const { chainId } = useActiveWeb3React()
  const { isMobile } = useBreakpoints()
  const { avatarUrl, fundName } = useContext(CreateFundContext)

  return (
    <S.SuccessBackdrop className={"success-backdrop"}>
      <S.ModalTitle>Congrats!</S.ModalTitle>
      <S.SuccessAvatarWrp>
        <S.SuccessAvatar
          src={avatarUrl.get === "" ? defaultAvatar : avatarUrl.get}
        />
      </S.SuccessAvatarWrp>
      <S.SuccessTitle>{fundName.get}</S.SuccessTitle>
      <S.SuccessSubtitle
        href={
          chainId
            ? getExplorerLink(
                chainId,
                createdFundAddress,
                ExplorerDataType.ADDRESS
              )
            : ""
        }
        iconColor={theme.brandColors.secondary}
        color={theme.brandColors.secondary}
      >
        {shortenAddress(createdFundAddress)}
      </S.SuccessSubtitle>
      <S.SuccessDescription>
        <Flex full ai="center" jc="center" gap={"12"}>
          <S.SuccessGreenIcon name={ICON_NAMES.greenCheck} />
          <p>Listable on Exchandges</p>
        </Flex>
        <Flex full ai="center" jc="center" gap={"12"}>
          <S.SuccessGreenIcon name={ICON_NAMES.greenCheck} />
          <p>Smart Contract Ready</p>
        </Flex>
        <Flex full ai="center" jc="center" gap={"12"}>
          <S.SuccessGreenIcon name={ICON_NAMES.greenCheck} />
          <p>Borderless Transactions</p>
        </Flex>
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
            text="Activate my fund"
            size="large"
            color={isMobile ? "primary" : "tertiary"}
            routePath={generatePath(ROUTE_PATHS.poolProfile, {
              poolAddress: createdFundAddress,
              "*": "",
            })}
            onClick={() => close()}
          />
          <S.SuccessCloseBtn
            text="Invest in my fund later"
            size="large"
            color={"secondary"}
            onClick={close}
          />
        </S.SuccessSubmitBtnWrp>
      </S.SuccessFooter>
    </S.SuccessBackdrop>
  )
}

export { SuccessModal }
