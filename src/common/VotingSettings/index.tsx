import React, { HTMLAttributes } from "react"

import { DaoVotingSettings } from "types"

import * as S from "./styled"

type DaoSettingsNotRequired = Partial<
  Omit<DaoVotingSettings, "executorDescription">
>

interface IVotingSettingsProps
  extends HTMLAttributes<HTMLDivElement>,
    DaoSettingsNotRequired {}

const VotingSettings: React.FC<IVotingSettingsProps> = ({
  duration,
  quorum,
  ...rest
}) => {
  return (
    <S.Root {...rest}>
      {duration && <p style={{ color: "white" }}>duraion: {duration}</p>}
      {quorum && <p style={{ color: "white" }}>quorum: {quorum}</p>}
    </S.Root>
  )
}

export default VotingSettings
