import { FC, ReactNode } from "react"
import { Flex } from "theme"
import * as S from "../styled"

interface Props {
  icon: ReactNode
  title: string
  action?: ReactNode
}

const CreateDaoCardHead: FC<Props> = ({ icon, title, action }) => {
  return (
    <Flex ai="center" jc="space-between" full>
      <Flex ai="center" gap="12">
        {icon}
        <S.CreateDaoCardTitle>{title}</S.CreateDaoCardTitle>
      </Flex>
      {action ? action : <></>}
    </Flex>
  )
}

export default CreateDaoCardHead
