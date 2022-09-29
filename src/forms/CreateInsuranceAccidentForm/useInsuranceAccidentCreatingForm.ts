import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {
  InsuranceDueDate,
  InsuranceAccident,
  InsuranceAccidentExist,
  PoolPriceHistoryDueDate,
  InvestorsTotalsData,
  InvestorsTotals,
  InvestorsInfo,
} from "context/InsuranceAccidentCreatingContext"
import { selectInsuranceAccidentByPool } from "state/ipfsMetadata/selectors"
import { Insurance } from "interfaces/thegraphs/investors"
import { IPriceHistoryWithCalcPNL } from "interfaces/thegraphs/all-pools"

interface IResult {
  context: {
    form: InsuranceAccident
    insuranceAccidentExist: InsuranceAccidentExist
    insuranceDueDate: InsuranceDueDate
    poolPriceHistoryDueDate: PoolPriceHistoryDueDate
    investorsTotals: InvestorsTotals
    investorsInfo: InvestorsInfo
  }
}

export const useInsuranceAccidentCreatingForm = (): IResult => {
  const state = {
    pool: useState(""),
    block: useState(""),
    date: useState(""),
    description: useState(""),
    chat: useState(""),
  }
  const form = {
    pool: {
      get: state.pool[0],
      set: state.pool[1],
    },
    block: {
      get: state.block[0],
      set: state.block[1],
    },
    date: {
      get: state.date[0],
      set: state.date[1],
    },
    description: {
      get: state.description[0],
      set: state.description[1],
    },
    chat: {
      get: state.chat[0],
      set: state.chat[1],
    },
  }

  const insuranceAccidentExistState = useState(false)
  const insuranceAccidentExist = {
    get: insuranceAccidentExistState[0],
    set: insuranceAccidentExistState[1],
  }

  const insuranceDueDateState = useState<Insurance | undefined>()
  const insuranceDueDate = {
    get: insuranceDueDateState[0],
    set: insuranceDueDateState[1],
  }

  const poolPriceHistoryDueDateState = useState<
    IPriceHistoryWithCalcPNL | undefined
  >()
  const poolPriceHistoryDueDate = {
    get: poolPriceHistoryDueDateState[0],
    set: poolPriceHistoryDueDateState[1],
  }

  const accidentByChosenPool = useSelector(
    selectInsuranceAccidentByPool(form.pool.get)
  )
  useEffect(() => {
    insuranceAccidentExist.set(accidentByChosenPool !== null)
  }, [accidentByChosenPool])

  const investorsTotalsState = useState<InvestorsTotalsData | undefined>()
  const investorsTotals = {
    get: investorsTotalsState[0],
    set: investorsTotalsState[1],
  }

  const investorsInfoState = useState<any | undefined>()
  const investorsInfo = {
    get: investorsInfoState[0],
    set: investorsInfoState[1],
  }

  return {
    context: {
      form,
      insuranceAccidentExist,
      insuranceDueDate,
      poolPriceHistoryDueDate,
      investorsTotals,
      investorsInfo,
    },
  }
}
