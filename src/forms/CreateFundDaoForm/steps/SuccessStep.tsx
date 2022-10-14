import { FC, HTMLAttributes, useContext } from "react"

import * as S from "../styled"
import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import { ICON_NAMES } from "../../../constants/icon-names"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const SuccessStep: FC<Props> = () => {
  const { avatarUrl, daoName } = useContext(FundDaoCreatingContext)
  return (
    <>
      <S.SuccessBackdrop>
        <S.SuccessAvatarWrp>
          <S.SuccessAvatar
            src={
              avatarUrl.get ||
              "https://images.unsplash.com/photo-1665596666171-2378d6e973b9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80"
            }
          />
        </S.SuccessAvatarWrp>
        <S.SuccessTitle>{daoName.get || "DaoName"}</S.SuccessTitle>
        <S.SuccessSubtitle href="https://www.youtube.com/" iconColor="#788AB4">
          address
        </S.SuccessSubtitle>
        <S.SuccessDescription>
          <p>You just successfully created a DAO!</p>
          <br />
          <p>
            Now you and other members can govern it via proposals. Congrats!
          </p>
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
          <S.SuccessLinkBtn text="Go to DAO profile" size="large" />
        </S.SuccessFooter>
      </S.SuccessBackdrop>
    </>
  )
}

export default SuccessStep
