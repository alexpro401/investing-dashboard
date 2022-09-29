import { FC, useContext, useEffect, useMemo, useState } from "react"
import { useQuery, createClient, Provider as GraphProvider } from "urql"

import { useActiveWeb3React } from "hooks"
import { PoolsByInvestorsQuery } from "queries/all-pools"

import CreateInsuranceAccidentCardHead from "forms/CreateInsuranceAccidentForm/components/CreateInsuranceAccidentCardHead"
import CreateInsuranceAccidentCardStepNumber from "forms/CreateInsuranceAccidentForm/components/CreateInsuranceAccidentCardStepNumber"
import CreateInsuranceAccidentPools from "forms/CreateInsuranceAccidentForm/components/CreateInsuranceAccidentPools"

import {
  Content,
  CreateInsuranceAccidentCard as CIACard,
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
      investors: [account],
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
      <Content>
        <CIACard.Container>
          <CreateInsuranceAccidentCardHead
            icon={<CreateInsuranceAccidentCardStepNumber number={1} />}
            title="Choose the fund for proposals"
          />
          <CIACard.Description>
            <p>
              Что это такое текст как это работает текст Что это такое текст.
              <br />
              как это работает текст Что это такое.
            </p>
          </CIACard.Description>
        </CIACard.Container>

        <div>
          <CreateInsuranceAccidentPools
            loading={response.fetching}
            payload={pools}
            total={totalPools}
          />
        </div>
      </Content>
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
