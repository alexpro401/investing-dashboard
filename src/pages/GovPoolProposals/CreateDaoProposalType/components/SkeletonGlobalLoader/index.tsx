import React from "react"

import Skeleton from "components/Skeleton"
import FormStepsLoaderWrapper from "common/FormSteps/FormStepsLoaderWrapper"
import { useBreakpoints } from "hooks"
import { Flex } from "theme"

import * as S from "./styled"

const SkeletonGlobalLoader: React.FC = () => {
  const { isMobile } = useBreakpoints()

  return (
    <FormStepsLoaderWrapper>
      <S.SkeletonLoader>
        {isMobile && (
          <>
            <Skeleton variant={"rect"} w={"calc(100%)"} h={"100px"} />
            <Skeleton variant={"rect"} w={"calc(100%)"} h={"100px"} />
            <Skeleton variant={"rect"} w={"calc(100%)"} h={"100px"} />
            <Skeleton variant={"rect"} w={"calc(100%)"} h={"250px"} />
            <Skeleton variant={"rect"} w={"calc(100%)"} h={"100px"} />
            <Skeleton variant={"rect"} w={"calc(100%)"} h={"250px"} />
          </>
        )}
        {!isMobile && (
          <>
            <Flex full dir="column" ai="flex-start" jc="flex-start" gap="12">
              <Skeleton variant={"text"} w={"300px"} h={"24px"} />
              <Skeleton variant={"text"} w={"500px"} h={"32px"} />
            </Flex>
            <Flex full dir="column" ai="flex-start" jc="flex-start" gap="32">
              <Skeleton variant={"rect"} w={"calc(100%)"} h={"125px"} />
              <Skeleton variant={"rect"} w={"calc(100%)"} h={"190px"} />
              <Skeleton variant={"rect"} w={"calc(100%)"} h={"125px"} />
              <Skeleton variant={"rect"} w={"calc(100%)"} h={"270px"} />
            </Flex>
          </>
        )}
      </S.SkeletonLoader>
    </FormStepsLoaderWrapper>
  )
}

export default SkeletonGlobalLoader
