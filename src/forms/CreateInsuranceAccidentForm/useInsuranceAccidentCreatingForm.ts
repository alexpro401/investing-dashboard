import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {
  InsuranceAccident,
  InsuranceAccidentExist,
} from "context/InsuranceAccidentCreatingContext"
import { selectInsuranceAccidentByPool } from "state/ipfsMetadata/selectors"

interface IResult {
  context: {
    form: InsuranceAccident
    insuranceAccidentExist: InsuranceAccidentExist
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

  const accidentByChosenPool = useSelector(
    selectInsuranceAccidentByPool(form.pool.get)
  )
  useEffect(() => {
    insuranceAccidentExist.set(accidentByChosenPool !== null)
  }, [accidentByChosenPool])

  return {
    context: { form, insuranceAccidentExist },
  }
}
