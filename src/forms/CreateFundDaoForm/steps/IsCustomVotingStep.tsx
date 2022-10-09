import { FC, useContext } from "react"
import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import { AppButton, Card, CardDescription, CardHead, Icon } from "common"
import { CreateDaoCardStepNumber } from "../components"

import * as S from "../styled"
import { ICON_NAMES } from "constants/icon-names"
import Switch from "components/Switch"

const IsCustomVotingStep: FC = () => {
  const { isCustomVoting } = useContext(FundDaoCreatingContext)

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
