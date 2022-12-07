import * as React from "react"
import * as S from "./styled"
import Skeleton from "components/Skeleton"
import { NavLinkProps } from "react-router-dom"

const Base = React.lazy(() => import("./variant/Base"))
const Insurance = React.lazy(() => import("./variant/Insurance"))

const GovProposalCardHeadFallback: React.FC = () => (
  <S.Content>
    <Skeleton variant={"text"} w={"calc(100% - 35px)"} h={"19px"} />
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
