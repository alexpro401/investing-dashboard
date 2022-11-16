import * as React from "react"
import { Center, Text } from "theme"
import * as S from "../styled"

const DaoClaimTabDistribution: React.FC = () => {
  return (
    <>
      <S.List>
        <Center>
          <Text>Distribution</Text>
        </Center>
      </S.List>
      <S.BottomActionContainer>
        <S.AppButtonFull text={"Claim All distributed tokens"} />
      </S.BottomActionContainer>
    </>
  )
}

export default DaoClaimTabDistribution
