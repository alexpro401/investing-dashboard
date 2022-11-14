import * as React from "react"
import * as S from "../styled"
import { isEmpty, isNil, map } from "lodash"
import { useWeb3React } from "@web3-react/core"
import { PulseSpinner } from "react-spinners-kit"

import { Card } from "common"
import { ZERO } from "constants/index"
import theme, { Center, Flex, Text } from "theme"
import GovDelegateeCard from "components/cards/GovDelegatee"

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
  {
    id: "1",
    pool: { id: "0x85076c78189e585df902da1fb4ba188886377c95" },
    timestamp: "1668182145599",
    from: {
      id: "0x6Ef18542040b7a60F323A80bDccbDe1912C0853f",
    },
    to: {
      id: "0xFEC006832A5B1f1A3c59CAA10f804607AD5438E2",
    },
    isDelegate: true,
    amount: ZERO.toString(),
    nfts: [],
  },
  {
    id: "2",
    pool: { id: "0x85076c78189e585df902da1fb4ba188886377c95" },
    timestamp: "1668182151538",
    from: {
      id: "0x6Ef18542040b7a60F323A80bDccbDe1912C0853f",
    },
    to: {
      id: "0xFEC006832A5B1f1A3c59CAA10f804607AD5438E2",
    },
    isDelegate: true,
    amount: undefined,
    nfts: [ZERO.toString(), ZERO.toString()],
  },
  {
    id: "3",
    pool: { id: "0x85076c78189e585df902da1fb4ba188886377c95" },
    timestamp: "1668182430601",
    from: {
      id: "0xFEC006832A5B1f1A3c59CAA10f804607AD5438E2",
    },
    to: {
      id: "0x6Ef18542040b7a60F323A80bDccbDe1912C0853f",
    },
    isDelegate: false,
    amount: ZERO.toString(),
    nfts: [ZERO.toString()],
  },
]

const DaoDelegationIn: React.FC = () => {
  const { chainId } = useWeb3React()
  const _loading = React.useState(true)
  const _data = React.useState<any[]>()

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      _data[1](delegationHistories)
      _loading[1](false)
      clearTimeout(timeout)
    }, 1250)
  }, [])

  if (_loading[0] && (isEmpty(_data[0]) || isNil(_data[0]))) {
    return (
      <S.List>
        <Center>
          <PulseSpinner color={theme.statusColors.success} />
        </Center>
      </S.List>
    )
  }

  if (!_loading[0] && isEmpty(_data[0])) {
    return (
      <S.List>
        <Center>
          <Text color={theme.textColors.secondary}>No Delegations</Text>
        </Center>
      </S.List>
    )
  }

  return (
    <S.List>
      <S.Indents top>
        <Card>
          <Flex full ai={"center"} jc={"space-between"}>
            <Text color={theme.textColors.primary}>Total addresses: 90</Text>
            <Text color={theme.textColors.primary}>Total delegate: 90,000</Text>
          </Flex>
          <Flex full dir={"column"} gap={"8"}>
            {map(_data[0], (dh, index) => (
              <GovDelegateeCard data={dh} chainId={chainId} key={index} />
            ))}
          </Flex>
        </Card>
      </S.Indents>
    </S.List>
  )
}

export default DaoDelegationIn
