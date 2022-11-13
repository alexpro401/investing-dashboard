import * as React from "react"
import { v4 as uuidv4 } from "uuid"
import { isEmpty, isNil, map } from "lodash"
import { PulseSpinner } from "react-spinners-kit"

import * as S from "../styled"
import theme, { Center, Text } from "theme"
import GovTokenDelegationCard from "components/cards/GovTokenDelegation"
import { ZERO } from "constants/index"
import { useWeb3React } from "@web3-react/core"

const DaoDelegationOut: React.FC = () => {
  const { chainId } = useWeb3React()
  const loading = true
  const delegationHistories = [
    {
      id: "0",
      pool: { id: "0x85076c78189e585df902da1fb4ba188886377c95" },
      timestamp: "1668182133879",
      from: {
        id: "0x6Ef18542040b7a60F323A80bDccbDe1912C0853f",
      },
      to: {
        id: "0xFEC006832A5B1f1A3c59CAA10f804607AD5438E2",
      },
      isDelegate: false,
      amount: ZERO.toString(),
      nfts: [ZERO.toString(), ZERO.toString()],
    },
    // {
    //   id: "1",
    //   pool: { id: "0x85076c78189e585df902da1fb4ba188886377c95" },
    //   timestamp: "1668182145599",
    //   from: {
    //     id: "0x6Ef18542040b7a60F323A80bDccbDe1912C0853f",
    //   },
    //   to: {
    //     id: "0xFEC006832A5B1f1A3c59CAA10f804607AD5438E2",
    //   },
    //   isDelegate: false,
    //   amount: ZERO.toString(),
    //   nfts: [],
    // },
    // {
    //   id: "2",
    //   pool: { id: "0x85076c78189e585df902da1fb4ba188886377c95" },
    //   timestamp: "1668182151538",
    //   from: {
    //     id: "0x6Ef18542040b7a60F323A80bDccbDe1912C0853f",
    //   },
    //   to: {
    //     id: "0xFEC006832A5B1f1A3c59CAA10f804607AD5438E2",
    //   },
    //   isDelegate: false,
    //   amount: undefined,
    //   nfts: [ZERO.toString(), ZERO.toString()],
    // },
    // {
    //   id: "3",
    //   pool: { id: "0x85076c78189e585df902da1fb4ba188886377c95" },
    //   timestamp: "1668182430601",
    //   from: {
    //     id: "0xFEC006832A5B1f1A3c59CAA10f804607AD5438E2",
    //   },
    //   to: {
    //     id: "0x6Ef18542040b7a60F323A80bDccbDe1912C0853f",
    //   },
    //   isDelegate: false,
    //   amount: ZERO.toString(),
    //   nfts: [ZERO.toString()],
    // },
  ]

  if (loading && (isEmpty(delegationHistories) || isNil(delegationHistories))) {
    return (
      <Center>
        <PulseSpinner color={theme.statusColors.success} />
      </Center>
    )
  }

  if (!loading && isEmpty(delegationHistories)) {
    return (
      <Center>
        <Text color={theme.textColors.secondary}>No Delegations</Text>
      </Center>
    )
  }

  return (
    <S.List>
      {map(delegationHistories, (delegationHistory, index) => (
        <S.Indents top key={uuidv4()}>
          <GovTokenDelegationCard
            data={delegationHistory}
            chainId={chainId}
            showMore={delegationHistories.length === 1}
          />
        </S.Indents>
      ))}
    </S.List>
  )
}

export default DaoDelegationOut
