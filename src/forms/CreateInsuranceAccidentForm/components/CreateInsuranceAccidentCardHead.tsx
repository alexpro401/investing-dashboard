import { FC, ReactNode } from "react"

import { Flex } from "theme"
import { CreateInsuranceAccidentCard as CIACard } from "forms/CreateInsuranceAccidentForm/styled"

interface Props {
  icon: ReactNode
  title: string
  action?: ReactNode
}

const CreateInsuranceAccidentCardHead: FC<Props> = ({
  icon,
  title,
  action,
}) => {
  return (
    <CIACard.Head ai="center" jc="space-between" full>
      <Flex ai="center" gap="12">
        {icon}
        <CIACard.Title>{title}</CIACard.Title>
      </Flex>
      {action ? action : <></>}
    </CIACard.Head>
  )
}

export default CreateInsuranceAccidentCardHead
