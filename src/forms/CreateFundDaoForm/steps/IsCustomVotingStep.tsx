import { FC, useContext } from "react"
import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import { AppButton, Card, CardDescription, CardHead, Icon } from "common"
import { CreateDaoCardStepNumber } from "../components"

import * as S from "../styled"
import { ICON_NAMES } from "constants/icon-names"
import Switch from "components/Switch"
import useAlert, { AlertType } from "hooks/useAlert"

const IsCustomVotingStep: FC = () => {
  const { isCustomVoting } = useContext(FundDaoCreatingContext)

  const [showAlert] = useAlert()

  const handleClickShowAlert = () => {
    showAlert({
      title: "Why you may need this?",
      content: (
        <>
          <S.InfoPopupContent>
            <S.InfoPopupContentTitle>Example 1</S.InfoPopupContentTitle>
            <S.InfoPopupContentText>
              E.g., you see that proposals are not reaching quorum so you want
              to lower it. But your proposals to change the quorum also don’t
              reach the quorum. Here you can have a proposal to change quorum
              requirements for all proposal types with a lower quorum.
            </S.InfoPopupContentText>
            <S.InfoPopupContentTitle>Example 2</S.InfoPopupContentTitle>
            <S.InfoPopupContentText>
              You want the proposals that change general voting settings to have
              a higher barrier to avoid abuse and to be voted on by only large
              token holders. Here you can set the minimum voting threshold to a
              high level in order to achieve this.
            </S.InfoPopupContentText>
          </S.InfoPopupContent>
        </>
      ),
      type: AlertType.info,
      hideDuration: 1000000,
    })
  }

  return (
    <>
      <S.StepsRoot>
        <Card>
          <CardHead
            nodeLeft={<CreateDaoCardStepNumber number={4} />}
            title="Changing General voting settings"
          />
          <CardDescription>
            <p>
              Configure the settings for proposals to change the General voting
              settings (the ones you set up in the previous step).
            </p>
            <br />
            <p>By default, these proposals use the general voting settings.</p>
            <br />
            <AppButton
              text="Why you may need this?"
              color="default"
              size="no-paddings"
              onClick={handleClickShowAlert}
            />
          </CardDescription>
        </Card>

        <Card>
          <CardHead
            nodeLeft={<Icon name={ICON_NAMES.cog} />}
            title="Set custom voting settings"
            nodeRight={
              <Switch
                isOn={isCustomVoting.get}
                onChange={(n, v) => isCustomVoting.set(v)}
                name={
                  "Turn on to set custom voting settings for changing general voting settings."
                }
              />
            }
          />
          <CardDescription>
            <p>
              Adding validators activates two-stage voting for enhanced DAO
              security. You can also add this function after the DAO is created,
              by voting.
            </p>
          </CardDescription>
        </Card>
      </S.StepsRoot>
      <S.StepsBottomNavigation />
    </>
  )
}

export default IsCustomVotingStep
