import { FC, useContext, useState } from "react"
import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import { AppButton, Card, CardDescription, CardHead, Icon, Popup } from "common"
import { CreateDaoCardStepNumber } from "../components"

import * as S from "../styled"
import { ICON_NAMES } from "constants/icon-names"
import Switch from "components/Switch"

const IsDistributionProposalStep: FC = () => {
  const [isPopupShown, setIsPopupShown] = useState(false)
  const { isDistributionProposal } = useContext(FundDaoCreatingContext)

  return (
    <>
      <S.StepsRoot>
        <Card>
          <CardHead
            nodeLeft={<CreateDaoCardStepNumber number={6} />}
            title="Token distribution proposal settings"
          />
          <CardDescription>
            <p>
              Configure the settings for proposals to distribute tokens from the
              DAO treasury to members.
            </p>
            <br />
            <p>
              After the voting, members can claim the distribution. Reward size
              depends on member’s voting power (number of tokens voted with).
            </p>
            <br />
            <p>By default, these proposals use the general voting settings.</p>
            <br />
            <p>
              *To ensure fair token distribution, Early vote completion and Vote
              delegation settings are turned off.
            </p>
            <br />
            <AppButton
              text="Details"
              color="default"
              size="no-paddings"
              onClick={() => setIsPopupShown(true)}
            />
          </CardDescription>
        </Card>

        <Card>
          <CardHead
            nodeLeft={<Icon name={ICON_NAMES.cog} />}
            title="Set custom voting settings"
            nodeRight={
              <Switch
                isOn={isDistributionProposal.get}
                onChange={(n, v) => isDistributionProposal.set(v)}
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

        <Popup isShown={isPopupShown} setIsShown={setIsPopupShown}>
          <S.InfoPopupContent>
            <S.InfoPopupActions>
              <S.InfoPopupIcon name={ICON_NAMES.star} />
              <S.InfoPopupHeaderTitle>Details</S.InfoPopupHeaderTitle>
              <S.InfoPopupCloseBtn onClick={() => setIsPopupShown(false)} />
            </S.InfoPopupActions>
            <S.InfoPopupContentText>
              With this type of proposal, your DAO will have fair rewards
              proportional to each hodler’s token count.
              <br />
              <br /> Let’s say you want to distribute your DAO’s quarterly
              earnings to holders. You need to create a proposal with the token
              name and quantity to be distributed. Everybody who votes on this
              proposal will be able to claim tokens proportionally to how many
              tokens they voted with.
            </S.InfoPopupContentText>
          </S.InfoPopupContent>
        </Popup>
      </S.StepsRoot>
      <S.StepsBottomNavigation />
    </>
  )
}

export default IsDistributionProposalStep
