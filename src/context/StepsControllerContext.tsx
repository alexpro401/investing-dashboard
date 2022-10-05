import { createContext, FC, HTMLAttributes } from "react"

interface StepsControllerContext {
  totalStepsAmount: number
  currentStepNumber: number
  prevCb: (cb?: () => void) => void
  nextCb: (cb?: () => void) => void
}

export const stepsControllerContext = createContext<StepsControllerContext>({
  totalStepsAmount: 0,
  currentStepNumber: 0,
  nextCb(): void {},
  prevCb(): void {},
})

interface Props extends HTMLAttributes<HTMLDivElement> {
  totalStepsAmount: number
  currentStepNumber: number
  prevCb: (cb?: () => void) => void
  nextCb: (cb?: () => void) => void
}

const StepsControllerContext: FC<Props> = ({
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
        totalStepsAmount,
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
