import { FC, useContext, useEffect } from "react"
import { createClient, Provider as GraphProvider } from "urql"
import { isEmpty, isNil } from "lodash"

import CreateInsuranceAccidentCardStepNumber from "forms/CreateInsuranceAccidentForm/components/CreateInsuranceAccidentCardStepNumber"
import CreateInsuranceAccidentPools from "forms/CreateInsuranceAccidentForm/components/CreateInsuranceAccidentPools"

import { Card, CardDescription, CardHead } from "common"
import {
  StepsRoot,
  StepsBottomNavigation,
} from "forms/CreateInsuranceAccidentForm/styled"
import { InsuranceAccidentCreatingContext } from "context/InsuranceAccidentCreatingContext"
import InsuranceAccidentExist from "modals/InsuranceAccidentExist"
import { useInsuranceAccidents } from "state/ipfsMetadata/hooks"
import useOwnedAndInvestedPools from "hooks/useOwnedAndInvestedPools"

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
})

const CreateInsuranceAccidentChooseFundStep: FC = () => {
  const { form, insuranceAccidentExist } = useContext(
    InsuranceAccidentCreatingContext
  )
  const { pool } = form

  const [
    { insuranceAccidentByPool },
    { getInsuranceAccidentByPool, fetchAll },
  ] = useInsuranceAccidents()

  useEffect(() => {
    fetchAll()
  }, [])
  useEffect(() => {
    getInsuranceAccidentByPool(pool.get)
  }, [pool])

  useEffect(() => {
    insuranceAccidentExist.set(
      !isEmpty(insuranceAccidentByPool) && !isNil(insuranceAccidentByPool)
    )
  }, [insuranceAccidentByPool])

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
