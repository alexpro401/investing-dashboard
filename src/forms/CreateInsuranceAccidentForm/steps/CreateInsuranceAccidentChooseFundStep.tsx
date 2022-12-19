import { FC } from "react"
import { createClient, Provider as GraphProvider } from "urql"

import CreateInsuranceAccidentCardStepNumber from "forms/CreateInsuranceAccidentForm/components/CreateInsuranceAccidentCardStepNumber"
import CreateInsuranceAccidentPools from "forms/CreateInsuranceAccidentForm/components/CreateInsuranceAccidentPools"

import { Card, CardDescription, CardHead } from "common"
import {
  StepsRoot,
  StepsBottomNavigation,
} from "forms/CreateInsuranceAccidentForm/styled"
import useOwnedAndInvestedPools from "hooks/useOwnedAndInvestedPools"

const allPoolsApiUrl = process.env.REACT_APP_ALL_POOLS_API_URL ?? ""

const allPoolsClient = createClient({ url: allPoolsApiUrl })

const CreateInsuranceAccidentChooseFundStep: FC = () => {
  const [{ data: pools, total, fetching }] = useOwnedAndInvestedPools()

  return (
    <>
      <StepsRoot
        gap={"16"}
        dir={"column"}
        jc={"flex-start"}
        ai={"stretch"}
        p={"16px"}
        full
      >
        <Card>
          <CardHead
            nodeLeft={<CreateInsuranceAccidentCardStepNumber number={1} />}
            title="Choose the fund for proposals"
          />
          <CardDescription>
            <p>
              Что это такое текст как это работает текст Что это такое текст.
              <br />
              как это работает текст Что это такое.
            </p>
          </CardDescription>
        </Card>

        <div>
          <CreateInsuranceAccidentPools
            loading={fetching}
            payload={pools}
            total={total}
          />
        </div>
      </StepsRoot>
      <StepsBottomNavigation />
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
