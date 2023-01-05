import ExchangeInput from "components/Exchange/ExchangeInput"
import NftInput from "components/Exchange/NftInput"
import { ZERO } from "consts"
import NftSelect from "modals/NftSelect"
import { FC, useCallback, useMemo } from "react"
import { Flex } from "theme"
import useWithdrawDaoPool, { ButtonTypes } from "./useWithdrawDaoPool"
import { useParams } from "react-router-dom"
import * as S from "components/Exchange/styled"
import Header from "components/Header/Layout"
import { shortenAddress } from "utils"
import Avatar from "components/Avatar"
import { useUserMetadata } from "state/ipfsMetadata/hooks"

interface Props {
  daoPoolAddress?: string
}

// WithdrawDaoPool - card component. can be used as separate element on the page
export const WithdrawDaoPool: FC<Props> = ({ daoPoolAddress }) => {
  const {
    account,
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
  } = useWithdrawDaoPool(daoPoolAddress)

  const [{ userAvatar }] = useUserMetadata(account)

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
        onClick={() => handleSubmit()}
        text="Confirm withdraw"
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
          <S.Title active>Withdrawal</S.Title>
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

        <ExchangeInput
          price={ZERO}
          customPrice={<S.InfoGrey>Tokens/votes to withdraw</S.InfoGrey>}
          amount={formInfo.address.totalPower.toString()}
          balance={ZERO}
          symbol={shortenAddress(account, 3)}
          decimal={18}
          customIcon={
            <Avatar url={userAvatar ?? ""} address={account} size={26} />
          }
          customBalance={<S.InfoGrey>My wallet</S.InfoGrey>}
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

// wrapps WithdrawDaoPool with router params and layout
const WithdrawDaoPoolPage = () => {
  const params = useParams()

  return (
    <>
      <Header>Withdraw from DAO pool</Header>
      <S.Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <WithdrawDaoPool {...params} />
      </S.Container>
    </>
  )
}

export default WithdrawDaoPoolPage
