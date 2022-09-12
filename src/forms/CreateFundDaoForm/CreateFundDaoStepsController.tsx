import { FC, HTMLAttributes } from "react"
import { Flex } from "../../theme"

import * as S from "./styled"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const CreateFundDaoStepsController: FC = () => {
  return (
    <Flex>
      <S.CreateFundDaoStepsProgress />
    </Flex>
  )
}

export default CreateFundDaoStepsController
