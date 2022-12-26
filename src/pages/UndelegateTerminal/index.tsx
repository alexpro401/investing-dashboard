import ExchangeInput from "components/Exchange/ExchangeInput"
import NftInput from "components/Exchange/NftInput"
import * as S from "components/Exchange/styled"
import { ZERO } from "constants/index"
import NftSelect from "modals/NftSelect"
import { FC, useCallback, useMemo } from "react"
import { Flex } from "theme"
import useUndelegateTerminal, { ButtonTypes } from "./useUndelegateTerminal"
import { useParams } from "react-router-dom"
import { Container } from "components/Exchange/styled"
import Header from "components/Header/Layout"
import WalletInput from "components/Exchange/WalletInput"
import { shortenAddress } from "utils"

interface Props {
  daoPoolAddress?: string
  delegatee?: string
}

// UndelegateTerminal - card component. can be used as separate element on the page
export const UndelegateTerminal: FC<Props> = ({
  daoPoolAddress,
  delegatee,
}) => {
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
    handleSubmit,
  } = useUndelegateTerminal(daoPoolAddress, delegatee)

  const button = useMemo(() => {
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
        text="Confirm Withdraw"
      />
    )
  }, [buttonType, handleSubmit])

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
          <S.Title active>Withdraw</S.Title>
        </S.CardHeader>

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
          address={formInfo.address.address}
          amount={formInfo.address.totalPower.toString()}
          nodeLeft="Votes to be received"
          nodeRight="Receiver address"
        />

        <Flex p="16px 0 0" full>
          {button}
        </Flex>
      </S.Card>
      <NftSelect
        nftPowerMap={nftPowerMap}
        defaultValue={selectedNftsStrings}
        handleSelect={selectNfts}
        isOpen={selectOpen}
        onClose={() => setSelectOpen(false)}
        nftIds={allNftsId}
      />
    </>
  )
}

// wrapps DelegateTerminal with router params and layout
const UndelegateTerminalPage = () => {
  const params = useParams()

  return (
    <>
      <Header>{shortenAddress(params.delegatee, 5)}</Header>
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <UndelegateTerminal {...params} />
      </Container>
    </>
  )
}

export default UndelegateTerminalPage
