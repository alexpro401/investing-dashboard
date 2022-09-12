import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

import { TransactionType } from "state/transactions/types"

import { getSlideTopVariants } from "motion/variants"

const barH = 52
const titleMB = 24

interface IValues {
  filter: TransactionType
  scrollH: number
  variants: any
}
interface IMethods {
  setFilter: Dispatch<SetStateAction<TransactionType>>
}

function useTransactionHistoryUI(
  scrollRef,
  titleRef,
  open
): [IValues, IMethods] {
  const [filter, setFilter] = useState<TransactionType>(TransactionType.SWAP)

  const [scrollH, setScrollH] = useState<number>(0)
  const [initialTop, setInitialTop] = useState<number>(0)

  const variants = useMemo(
    () => getSlideTopVariants(window.innerHeight - initialTop),
    [initialTop]
  )

  useEffect(() => {
    if (!scrollRef.current) return
    disableBodyScroll(scrollRef.current)

    return () => clearAllBodyScrollLocks()
  }, [scrollRef])

  useEffect(() => {
    if (!titleRef.current) return

    const titleRect = titleRef.current.getBoundingClientRect()
    setInitialTop(titleRect.bottom + titleMB)
  }, [titleRef])

  useEffect(() => {
    if (open) {
      setScrollH(window.innerHeight - barH * 2)
    } else {
      const t = setTimeout(() => {
        setScrollH(window.innerHeight - initialTop - barH * 2)
        clearTimeout(t)
      }, 400)
    }
  }, [open, initialTop])

  return [{ filter, scrollH, variants }, { setFilter }]
}

export default useTransactionHistoryUI
