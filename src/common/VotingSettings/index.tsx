import React, { HTMLAttributes, useMemo } from "react"

import { DaoVotingSettings } from "types"
import {
  parseSeconds,
  parseDuration,
  parseDurationShortString,
} from "utils/time"

import * as S from "./styled"

type DaoSettingsNotRequired = Partial<
  Omit<DaoVotingSettings, "executorDescription" | "quorum">
>

interface IVotingSettingsProps
  extends HTMLAttributes<HTMLDivElement>,
    DaoSettingsNotRequired {
  quorum: string
}

const VotingSettings: React.FC<IVotingSettingsProps> = ({
  duration,
  quorum,
  ...rest
}) => {
  const durationString = useMemo(
    () =>
      duration
        ? parseDurationShortString(parseDuration(parseSeconds(duration)))
        : null,
    [duration]
  )

  return (
    <S.Root {...rest}>
      {durationString && (
        <S.Record>
          <S.Label>Length of voting period</S.Label>
          <S.Value>{durationString}</S.Value>
        </S.Record>
      )}
      {quorum && (
        <S.Record>
          <S.Label>Votes needed for quorum</S.Label>
          <S.Value>{quorum}</S.Value>
        </S.Record>
      )}
    </S.Root>
  )
}

export default VotingSettings
