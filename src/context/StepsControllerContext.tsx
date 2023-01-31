import { createContext, FC, HTMLAttributes } from "react"

interface StepsControllerContext {
  steps?: {
    title: string
    number: number
  }[]
  setStep?: (n: number) => void
  totalStepsAmount: number
  currentStepNumber: number
  prevCb: (cb?: () => void) => void
  nextCb: (cb?: () => void) => void
}

export const stepsControllerContext = createContext<StepsControllerContext>({
  steps: [],
  totalStepsAmount: 0,
  currentStepNumber: 0,
  nextCb(): void {},
  prevCb(): void {},
})

interface Props extends HTMLAttributes<HTMLDivElement> {
  steps?: {
    title: string
    number: number
  }[]
  setStep?: (n: number) => void
  totalStepsAmount?: number
  currentStepNumber: number
  prevCb: (cb?: () => void) => void
  nextCb: (cb?: () => void) => void
}

const StepsControllerContext: FC<Props> = ({
  steps,
  setStep,
  totalStepsAmount,
  currentStepNumber,
  prevCb,
  nextCb,
  children,
  ...rest
}) => {
  return (
    <stepsControllerContext.Provider
      value={{
        steps,
        setStep,
        totalStepsAmount: Number(totalStepsAmount || steps?.length),
        currentStepNumber,
        prevCb,
        nextCb,
      }}
      {...rest}
    >
      {children}
    </stepsControllerContext.Provider>
  )
}

export default StepsControllerContext
