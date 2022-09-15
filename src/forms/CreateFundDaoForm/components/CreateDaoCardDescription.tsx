import { FC, HTMLAttributes } from "react"

import * as S from "../styled"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const CreateDaoCardDescription: FC<Props> = ({ children }) => {
  return <S.CreateDaoCardDescription>{children}</S.CreateDaoCardDescription>
}

export default CreateDaoCardDescription
