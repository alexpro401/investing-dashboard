import React, { useMemo, useCallback, useState, useEffect } from "react"
import { isNil, map } from "lodash"
import { useQuery } from "urql"

import theme, { Flex } from "theme"
import { ICON_NAMES } from "constants/icon-names"
import { UseQueryArgs } from "urql/dist/types/hooks/useQuery"

import * as S from "./styled"

interface Props<T> extends UseQueryArgs<T> {
  limit: number
  total: number
  nodeHead?: React.ReactNode
  nodeFooter?: React.ReactNode
  row: (item: T, i: number) => React.ReactNode
  variables: any
  formatter: (newDataSlice: any, loadedData?: undefined | T[]) => T[]
}

function PaginationTable<T>({
  limit,
  total,
  nodeHead,
  row,
  nodeFooter,
  formatter,
  query,
  variables,
  context,
  pause,
}: Props<T>) {
  const [offset, setOffset] = useState(0)
  const [lastOffset, setLastOffset] = useState<number>(0)
  const [records, setRecords] = useState<T[] | undefined>(undefined)
  const [dataInView, setDataInView] = useState<T[] | undefined>(undefined)

  console.log("records: ", records)

  const _variables = useMemo(
    () => ({
      ...variables,
      limit,
      offset,
    }),
    [variables, offset, limit]
  )

  const _pause = useMemo(
    () => pause || offset < lastOffset || (records && records.length === total),
    [pause, lastOffset, offset, records, total]
  )

  const [{ fetching, data }] = useQuery({
    query,
    variables: _variables,
    context,
    pause: _pause,
    requestPolicy: "network-only",
  })

  // Clear state helper
  const reset = useCallback(() => {
    setOffset(0)
    setRecords(undefined)
  }, [])

  // Clear state when query or variables changed
  useEffect(() => {
    reset()
  }, [query, variables, reset])

  useEffect(() => {
    if (
      data &&
      !fetching &&
      offset >= lastOffset &&
      (!records ||
        (records.length !== total && records.length < offset + limit))
    ) {
      const newPieceOfData = formatter(data, records)
      if (newPieceOfData.length > 0) {
        const newRecords: T[] =
          records && records.length !== 0
            ? [...records, ...newPieceOfData]
            : [...newPieceOfData]

        setRecords(newRecords)
        setDataInView(newRecords.slice(offset, offset + limit))
      }
      if (offset > lastOffset) {
        setLastOffset(offset)
      }
    } else if (!fetching) {
      setDataInView(records ? records.slice(offset, offset + limit) : undefined)
    }
  }, [fetching, offset, lastOffset, formatter, data, total, limit, records])

  const onPrev = useCallback(() => {
    if (offset === 0 || offset - limit <= 0) {
      setOffset(0)
    } else {
      setOffset(offset - limit)
    }
  }, [offset, limit])

  const onNext = useCallback(() => {
    if (offset + limit <= total) {
      setOffset(offset + limit)
    }
  }, [offset, limit, total])

  const Pagination = useMemo(() => {
    if (total <= limit) return null

    const end = offset + limit <= total ? offset + limit : total

    return (
      <>
        <S.Divider />
        <Flex full ai="center" jc="center" gap="7" m="16px 0 0">
          <S.Title color={theme.textColors.primary}>
            {offset + 1} - {end} of {total}
          </S.Title>
          <Flex ai="center" jc="center" gap="16">
            <S.NavButton
              iconLeft={ICON_NAMES.angleLeft}
              onClick={onPrev}
              disabled={offset === 0 || fetching}
            />
            <S.NavButton
              iconRight={ICON_NAMES.angleRight}
              onClick={onNext}
              disabled={offset + limit >= total || fetching}
            />
          </Flex>
        </Flex>
      </>
    )
  }, [total, limit, offset, onPrev, onNext, fetching])

  return (
    <div>
      {!isNil(nodeHead) && (
        <>
          <Flex full m={"0 0 16px"} dir={"column"}>
            {nodeHead}
          </Flex>
          <S.Divider />
        </>
      )}
      {dataInView && dataInView.length > 0 && (
        <>
          {map(dataInView, (item, index) => (
            <React.Fragment key={index}>
              <Flex full p="16px 0">
                {row(item, index)}
              </Flex>
              {index + 1 < dataInView.length ? <S.Divider /> : null}
            </React.Fragment>
          ))}
          {!isNil(nodeFooter) && nodeFooter}
          {Pagination}
        </>
      )}
    </div>
  )
}

export default PaginationTable
