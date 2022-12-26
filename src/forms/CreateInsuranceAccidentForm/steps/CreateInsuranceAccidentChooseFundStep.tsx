import { FC } from "react"
import { createClient, Provider as GraphProvider } from "urql"

import CreateInsuranceAccidentCardStepNumber from "forms/CreateInsuranceAccidentForm/components/CreateInsuranceAccidentCardStepNumber"
import CreateInsuranceAccidentPools from "forms/CreateInsuranceAccidentForm/components/CreateInsuranceAccidentPools"

import {
  StepsRoot,
  CreateInsuranceAccidentTopCard,
  CreateInsuranceAccidentTopCardHead,
  CreateInsuranceAccidentTopCardDescription,
} from "forms/CreateInsuranceAccidentForm/styled"
import useOwnedAndInvestedPools from "hooks/useOwnedAndInvestedPools"
import { useBreakpoints } from "hooks"

const allPoolsApiUrl = process.env.REACT_APP_ALL_POOLS_API_URL ?? ""

const allPoolsClient = createClient({ url: allPoolsApiUrl })

const CreateInsuranceAccidentChooseFundStep: FC = () => {
  const [{ data: pools, total, fetching }] = useOwnedAndInvestedPools()

  const { isMobile } = useBreakpoints()

  return (
    <>
      <StepsRoot>
        <CreateInsuranceAccidentTopCard>
          <CreateInsuranceAccidentTopCardHead
            nodeLeft={
              isMobile && <CreateInsuranceAccidentCardStepNumber number={1} />
            }
            title="Choose the fund for proposals"
          />
          <CreateInsuranceAccidentTopCardDescription>
            <p>
              Что это такое текст как это работает текст Что это такое текст.
              <br />
              как это работает текст Что это такое.
            </p>
          </CreateInsuranceAccidentTopCardDescription>
        </CreateInsuranceAccidentTopCard>

        <div>
          <CreateInsuranceAccidentPools
            loading={fetching}
            payload={pools}
            total={total}
          />
        </div>
      </StepsRoot>
    </>
  )
}

const CreateInsuranceAccidentChooseFundStepWithProvider = (props) => {
  return (
    <GraphProvider value={allPoolsClient}>
      <CreateInsuranceAccidentChooseFundStep {...props} />
    </GraphProvider>
  )
}

export default CreateInsuranceAccidentChooseFundStepWithProvider
