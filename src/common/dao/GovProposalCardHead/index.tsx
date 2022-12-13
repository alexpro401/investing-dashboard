import * as React from "react"
import * as S from "./styled"
import Skeleton from "components/Skeleton"
import { NavLinkProps } from "react-router-dom"
import { Flex } from "theme"

const Base = React.lazy(() => import("./variant/Base"))
const Insurance = React.lazy(() => import("./variant/Insurance"))

const GovProposalCardHeadFallback: React.FC = () => (
  <S.Content>
    <Flex gap={"8"}>
      <Skeleton variant={"rect"} w={"19px"} h={"19px"} />
      <Skeleton variant={"text"} w={"100px"} h={"19px"} />
    </Flex>

    <Skeleton variant={"rect"} w={"19px"} h={"19px"} />
  </S.Content>
)

interface Props extends NavLinkProps {
  isInsurance: boolean
  name: string
  pool?: string
  completed?: boolean
}

const GovProposalCardHead: React.FC<Props> = ({
  isInsurance,
  name,
  pool,
  completed,
  ...rest
}) => {
  const Head = isInsurance ? Insurance : Base

  return (
    <S.Container {...rest}>
      <React.Suspense fallback={<GovProposalCardHeadFallback />}>
        <Head name={name} pool={pool} completed={completed} />
      </React.Suspense>
    </S.Container>
  )
}

export default GovProposalCardHead
