import React, { Fragment, HTMLAttributes, ReactNode } from "react"

import { useBreakpoints } from "hooks"

import * as S from "./styled"

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const FormStepsLoaderWrapper: React.FC<Props> = ({ children, ...rest }) => {
  const { isMobile } = useBreakpoints()

  if (isMobile) {
    return <Fragment {...rest}>{children}</Fragment>
  }

  return (
    <S.StepsFormContainer
      currentStepNumber={1}
      totalStepsAmount={2}
      nextCb={() => {}}
      prevCb={() => {}}
    >
      <S.StepsWrapper>
        <S.StepsContainer>{children}</S.StepsContainer>
        <S.SideStepsNavigationBarWrp
          title={"Loading..."}
          steps={[{ number: 1, title: "Loading..." }]}
          currentStep={1}
        />
      </S.StepsWrapper>
    </S.StepsFormContainer>
  )
}

export default FormStepsLoaderWrapper
