import ExchangeInput from "components/Exchange/ExchangeInput"
import NftInput from "components/Exchange/NftInput"
import * as S from "components/Exchange/styled"
import { ZERO, ZERO_ADDR } from "constants/index"
import NftSelect from "modals/NftSelect"
import { FC, useCallback, useMemo } from "react"
import { Flex } from "theme"
import useVotingTerminal, { ButtonTypes } from "./useVotingTerminal"
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
    withDelegated,
    selectOpen,
    nftPowerMap,
    buttonType,
    ERC20Amount,
    ERC721Amount,
    ERC20Price,
    toggleDelegated,
    setSelectOpen,
    handleERC20Change,
    handleERC721Change,
    handleApprove,
    handleSubmit,
  } = useVotingTerminal(daoPoolAddress)

  const button = useMemo(() => {
    // not enough token balance
    if (buttonType === ButtonTypes.INUFICIENT_TOKEN_BALANCE) {
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

    if (buttonType === ButtonTypes.UNLOCK) {
      return (
        <S.SubmitButton
          color="secondary"
          type="button"
          size="large"
          onClick={handleApprove}
          text="Approve token"
          iconRight={ICON_NAMES.locked}
          iconSize={14}
        />
      )
    }

    if (buttonType === ButtonTypes.EMPTY_AMOUNT) {
      return (
        <S.SubmitButton
          disabled
          color="secondary"
          type="button"
          size="large"
          onClick={() => {}}
          text="Select amount"
        />
      )
    }

    return (
      <S.SubmitButton
        type="button"
        size="large"
        onClick={handleSubmit}
        text="Confirm voting"
      />
    )
  }, [buttonType, handleApprove, handleSubmit])

  // wrapper function to close modal on submit
  const selectNfts = useCallback(
    (ids: string[]) => {
      setSelectOpen(false)
      handleERC721Change(ids)
    },
    [handleERC721Change, setSelectOpen]
  )

  const selectedNftsStrings = useMemo(
    () => ERC721Amount.map((id) => id.toString()),
    [ERC721Amount]
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
            price={ERC20Price}
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
            nftPowerMap={nftPowerMap}
            selectedNfts={ERC721Amount}
            onSelectAll={() => selectNfts(allNftsId)}
            onSelect={() => setSelectOpen(true)}
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
