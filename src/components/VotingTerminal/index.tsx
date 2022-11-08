import ExchangeInput from "components/Exchange/ExchangeInput"
import NftInput from "components/Exchange/NftInput"
import * as S from "components/Exchange/styled"
import { ZERO, ZERO_ADDR } from "constants/index"
import NftSelect from "modals/NftSelect"
import { FC, useCallback, useMemo, useState } from "react"
import { Flex } from "theme"
import useVotingTerminal from "./useVotingTerminal"
import Tooltip from "components/Tooltip"
import { v4 as uuidv4 } from "uuid"
import Switch from "components/Switch"
import { ICON_NAMES } from "constants/icon-names"

interface Props {
  daoPoolAddress?: string
}

const VotingTerminal: FC<Props> = ({ daoPoolAddress }) => {
  const {
    formInfo,
    allNftsId,
    selectedNfts,
    handleSelect,
    withDelegated,
    toggleDelegated,
    selectOpen,
    setSelectOpen,
    handleERC20Change,
    ERC20Amount,
  } = useVotingTerminal(daoPoolAddress)

  const button = useMemo(() => {
    // not enough token balance
    if (formInfo.erc20.balance.lt(ERC20Amount)) {
      return (
        <S.SubmitButton
          disabled
          color="secondary"
          type="button"
          size="large"
          text="Inuficient token balance"
        />
      )
    }

    return (
      <S.SubmitButton
        color="secondary"
        type="button"
        size="large"
        onClick={() => {}}
        text="Unlock NFT"
        iconRight={ICON_NAMES.locked}
        iconSize={14}
      />
    )
    return (
      <S.SubmitButton
        color="secondary"
        type="button"
        size="large"
        onClick={() => {}}
        text="Select amount"
      />
    )
    return (
      <S.SubmitButton
        type="button"
        size="large"
        onClick={() => {}}
        text="Confirm voting & Create proposal"
      />
    )
  }, [ERC20Amount, formInfo.erc20.balance])

  // wrapper function to close modal on submit
  const selectNfts = useCallback(
    (ids: string[]) => {
      setSelectOpen(false)
      handleSelect(ids)
    },
    [handleSelect, setSelectOpen]
  )

  const selectedNftsStrings = useMemo(
    () => selectedNfts.map((id) => id.toString()),
    [selectedNfts]
  )

  return (
    <>
      <S.Card>
        <S.CardHeader>
          <S.Title active>Vote to create</S.Title>
        </S.CardHeader>

        <Flex p="0 8px 12px 8px" full ai="center">
          <Flex gap="6" ai="center">
            <Tooltip id={uuidv4()}>text</Tooltip>
            <S.TooltipText>Voting with delegated tokens</S.TooltipText>
          </Flex>
          <Switch
            isOn={withDelegated}
            name={uuidv4()}
            onChange={(n, v) => toggleDelegated(v)}
          />
        </Flex>

        {formInfo.erc20.address !== ZERO_ADDR && (
          <ExchangeInput
            price={ZERO}
            amount={ERC20Amount.toString()}
            balance={formInfo.erc20.balance || ZERO}
            address={formInfo.erc20.address}
            symbol={formInfo.erc20.symbol}
            decimal={formInfo.erc20.decimal}
            onChange={handleERC20Change}
          />
        )}

        <Flex full p="4px" />

        {formInfo.erc721.address !== ZERO_ADDR && (
          <NftInput
            selectedNfts={selectedNfts}
            onSelect={() => setSelectOpen(true)}
            price={ZERO}
            balance={formInfo.erc721.balance || ZERO}
            address={formInfo.erc721.address}
          />
        )}

        <Flex p="16px 0 0" full>
          {button}
        </Flex>
      </S.Card>
      <NftSelect
        defaultValue={selectedNftsStrings}
        handleSelect={selectNfts}
        isOpen={selectOpen}
        onClose={() => setSelectOpen(false)}
        nftIds={allNftsId}
      />
    </>
  )
}

export default VotingTerminal
