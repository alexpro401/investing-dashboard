import ExchangeInput from "components/Exchange/ExchangeInput"
import NftInput from "components/Exchange/NftInput"
import * as S from "components/Exchange/styled"
import { ZERO } from "consts"
import NftSelect from "modals/NftSelect"
import { FC, useCallback, useMemo } from "react"
import { Flex } from "theme"
import useDelegateTerminal, { ButtonTypes } from "./useDelegateTerminal"
import { ICON_NAMES } from "consts/icon-names"
import { useParams } from "react-router-dom"
import Header from "components/Header/Layout"
import WalletInput from "components/Exchange/WalletInput"
import ExternalLink from "components/ExternalLink"
import { Exchange } from "components/Exchange"

interface Props {
  daoPoolAddress?: string
  delegatee?: string
}

// DelegateTerminal - card component. can be used as separate element on the page
export const DelegateTerminal: FC<Props> = ({ daoPoolAddress, delegatee }) => {
  const {
    formInfo,
    allNftsId,
    selectOpen,
    nftPowerMap,
    buttonType,
    ERC20Amount,
    ERC721Amount,
    ERC20Price,
    setSelectOpen,
    handleERC20Change,
    handleERC721Change,
    handleApprove,
    handleSubmit,
    setDelegatee,
  } = useDelegateTerminal(daoPoolAddress, delegatee)

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
        text="Confirm Delegate"
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
    <Exchange
      title="Delegate"
      buttons={[button]}
      form={
        <>
          <S.DescriptionContainer>
            You can delegate your votes to another DAO member so they can vote
            on your behalf.{" "}
            <ExternalLink removeIcon href="#" fz="13px" fw="400">
              Details
            </ExternalLink>
            <br />
            <br />
            Adjust your token delegation below.
          </S.DescriptionContainer>
          <Flex p="8px" full ai="center"></Flex>
          {formInfo.haveToken && (
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
          {formInfo.haveNft && (
            <>
              <Flex full p="4px" />
              <NftInput
                nftPowerMap={nftPowerMap}
                selectedNfts={ERC721Amount}
                onSelectAll={() => selectNfts(allNftsId)}
                onSelect={() => setSelectOpen(true)}
                balance={formInfo.erc721.balance || ZERO}
                address={formInfo.erc721.address}
              />
            </>
          )}
          <Flex full p="4px" />
          <WalletInput
            address={formInfo.address.delegatee}
            amount={formInfo.address.totalPower.toString()}
            nodeLeft="Votes to be received"
            nodeRight="Receiver address"
            onChange={setDelegatee}
          />
        </>
      }
    >
      <NftSelect
        nftPowerMap={nftPowerMap}
        defaultValue={selectedNftsStrings}
        handleSelect={selectNfts}
        isOpen={selectOpen}
        onClose={() => setSelectOpen(false)}
        nftIds={allNftsId}
      />
    </Exchange>
  )
}

// wrapps DelegateTerminal with router params and layout
const DelegateTerminalPage = () => {
  const params = useParams()

  return (
    <>
      <Header>Delegate DAO tokens</Header>
      <S.Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <DelegateTerminal {...params} />
      </S.Container>
    </>
  )
}

export default DelegateTerminalPage
