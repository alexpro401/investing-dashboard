import React from "react"

import { useBreakpoints } from "hooks"
import { Flex } from "theme"

import * as S from "./styled"

const SkeletonCustomProposals: React.FC = () => {
  const { isMobile } = useBreakpoints()

  return (
    <>
      <Flex gap={"24"} full dir="column" ai={"center"}>
        <S.ProposalCardSkeleton
          variant={"rect"}
          w={isMobile ? "100%" : "100%"}
          h={isMobile ? "80px" : "135px"}
        />
      </Flex>
      {!isMobile && (
        <S.ProposalCardSkeleton variant={"rect"} w={"100%"} h={"135px"} />
      )}
    </>
  )
}

export { SkeletonCustomProposals }
