import { FC, useContext, useEffect, useMemo, useState } from "react"
import { useQuery, createClient, Provider as GraphProvider } from "urql"

import { useActiveWeb3React } from "hooks"
import { PoolsByInvestorsQuery } from "queries/all-pools"

import CreateInsuranceAccidentCardStepNumber from "forms/CreateInsuranceAccidentForm/components/CreateInsuranceAccidentCardStepNumber"
import CreateInsuranceAccidentPools from "forms/CreateInsuranceAccidentForm/components/CreateInsuranceAccidentPools"

import { Card, CardDescription, CardHead } from "common"
import {
  StepsRoot,
  StepsBottomNavigation,
} from "forms/CreateInsuranceAccidentForm/styled"
import { InsuranceAccidentCreatingContext } from "context/InsuranceAccidentCreatingContext"
import InsuranceAccidentExist from "modals/InsuranceAccidentExist"

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
})

const CreateInsuranceAccidentChooseFundStep: FC = () => {
  const { account } = useActiveWeb3React()

  const { insuranceAccidentExist } = useContext(
    InsuranceAccidentCreatingContext
  )

  const [response] = useQuery({
    pause: !account,
    query: PoolsByInvestorsQuery,
    variables: {
      investors: [String(account).toLocaleLowerCase()],
    },
  })

  const totalPools = useMemo<number>(() => {
    if (response.fetching || !!response.error) {
      return 0
    }

    return response.data?.traderPools.length
  }, [response])

  const [pools, setPools] = useState([])

  useEffect(() => {
    if (response.fetching) return
    if (!response.data || !response.data.traderPools) return
    if (response.data.traderPools.length === 0) return
    if (response.data.traderPools.length > 0) {
      setPools(response.data.traderPools)
    }
  }, [response])

  return (
    <>
      <StepsRoot gap={"16"} dir={"column"} ai={"stretch"} p={"16px"} full>
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
            loading={response.fetching}
            payload={pools}
            total={totalPools}
          />
        </div>
      </StepsRoot>
      <StepsBottomNavigation />
      {!insuranceAccidentExist.get && (
        <InsuranceAccidentExist
          isOpen={insuranceAccidentExist.get}
          onClose={() => insuranceAccidentExist.set(false)}
        />
      )}
    </>
  )
}

const CreateInsuranceAccidentChooseFundStepWithProvider = (props) => {
  return (
    <GraphProvider value={poolsClient}>
      <CreateInsuranceAccidentChooseFundStep {...props} />
    </GraphProvider>
  )
}

export default CreateInsuranceAccidentChooseFundStepWithProvider
