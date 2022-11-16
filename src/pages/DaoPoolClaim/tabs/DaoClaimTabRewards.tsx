import * as React from "react"
import { Center, Text } from "theme"
import * as S from "../styled"

const DaoClaimTabRewards: React.FC = () => {
  return (
    <>
      <S.List>
        <Center>
          <Text>Rewards</Text>
        </Center>
      </S.List>
      <S.BottomActionContainer>
        <S.AppButtonFull text={"Claim All rewards"} />
      </S.BottomActionContainer>
    </>
  )
}

export default DaoClaimTabRewards
