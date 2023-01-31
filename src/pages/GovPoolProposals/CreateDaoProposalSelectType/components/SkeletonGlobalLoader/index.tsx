import React, { useMemo } from "react"

import { useBreakpoints } from "hooks"
import Skeleton from "components/Skeleton"
import FormStepsLoaderWrapper from "common/FormSteps/FormStepsLoaderWrapper"

import * as S from "./styled"
import * as SPage from "../../styled"

const SkeletonGlobalLoader: React.FC = () => {
  const { isMobile } = useBreakpoints()

  const DesktopLoading = useMemo(
    () => (
      <SPage.PageHolder>
        <SPage.Content>
          <SPage.DesktopHeaderWrp>
            <Skeleton variant={"text"} w={"300px"} h={"30px"} />
            <br />
            <Skeleton variant={"text"} w={"400px"} h={"22px"} />
          </SPage.DesktopHeaderWrp>
          <Skeleton variant={"text"} w={"200px"} h={"20px"} />
          <SPage.BlockGrid>
            <S.ProposalCardSkeleton variant={"rect"} h={"135px"} />
            <S.ProposalCardSkeleton variant={"rect"} h={"135px"} />
            <S.ProposalCardSkeleton variant={"rect"} h={"135px"} />
            <S.ProposalCardSkeleton variant={"rect"} h={"135px"} />
            <S.ProposalCardSkeleton variant={"rect"} h={"135px"} />
            <S.ProposalCardSkeleton variant={"rect"} h={"135px"} />
          </SPage.BlockGrid>
          <Skeleton variant={"text"} w={"200px"} h={"20px"} />
          <SPage.BlockGrid>
            <S.ProposalCardSkeleton variant={"rect"} h={"135px"} />
            <S.ProposalCardSkeleton variant={"rect"} h={"135px"} />
          </SPage.BlockGrid>
        </SPage.Content>
      </SPage.PageHolder>
    ),
    []
  )

  const MobileLoading = useMemo(
    () => (
      <>
        <Skeleton variant={"rect"} w={"calc(100%)"} h={"80px"} />
        <Skeleton variant={"rect"} w={"calc(100%)"} h={"80px"} />
        <Skeleton variant={"rect"} w={"calc(100%)"} h={"80px"} />
        <Skeleton variant={"rect"} w={"calc(100%)"} h={"80px"} />
      </>
    ),
    []
  )

  return (
    <FormStepsLoaderWrapper>
      <S.SkeletonLoader alignItems={isMobile ? "center" : "flex-start"}>
        {isMobile ? MobileLoading : DesktopLoading}
      </S.SkeletonLoader>
    </FormStepsLoaderWrapper>
  )
}

export { SkeletonGlobalLoader }
