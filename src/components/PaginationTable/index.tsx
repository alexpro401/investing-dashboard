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
  data: T[] | undefined
  setData: (v: T[] | undefined) => void
  row: (item: T, i: number) => React.ReactNode
  variables: any
  formatter: (newDataSlice: any, loadedData?: undefined | T[]) => T[]
}

function PaginationTable<T>({
  limit,
  total,
  nodeHead,
  data,
  setData,
  row,
  nodeFooter,
  formatter,
  query,
  variables,
  context,
  pause,
}: Props<T>) {
  const [offset, setOffset] = useState(0)

  // checking if offset is already processed with graph request
  const offsetIsPassed = useMemo(
    () => data && offset < data.length - limit,
    [data, offset, limit]
  )

  const [dataInView, setDataInView] = useState<T[] | undefined>(undefined)

  const _variables = useMemo(
    () => ({
      ...variables,
      limit,
      offset,
    }),
    [variables, offset, limit]
  )

  const _pause = useMemo(
    () =>
      !!pause ||
      offsetIsPassed ||
      (offset === 0 && data && data.length !== 0) ||
      (data && data.length === total),
    [pause, offsetIsPassed, offset, data, total]
  )

  const [{ fetching, data: graphData }] = useQuery({
    query,
    variables: _variables,
    context,
    pause: _pause,
    requestPolicy: "network-only",
  })

  useEffect(() => {
    if (
      graphData &&
      !fetching &&
      !offsetIsPassed &&
      (!data || (data.length !== total && data.length < offset + limit))
    ) {
      const newPieceOfData = formatter(graphData, data)
      if (newPieceOfData.length > 0) {
        const newRecords: T[] =
          data && data.length !== 0
            ? [...data, ...newPieceOfData]
            : [...newPieceOfData]

        setData(newRecords)
        setDataInView(newRecords.slice(offset, offset + limit))
      }
    } else if (!fetching) {
      setDataInView(data ? data.slice(offset, offset + limit) : undefined)
    }
  }, [
    fetching,
    offset,
    offsetIsPassed,
    formatter,
    graphData,
    total,
    limit,
    data,
    setData,
  ])

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
