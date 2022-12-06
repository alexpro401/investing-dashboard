import { FC, useMemo } from "react"
import ToastBase from "./ToastBase"
import { TransactionBody, TransactionErrorContent } from "./styled"

import { ToastType } from "./types"

import ExternalLink from "components/ExternalLink"
import TransactionSummary from "components/TransactionSummary"
import TransactionWait from "components/TransactionSummary/TransactionWait"

import { useActiveWeb3React } from "hooks"
import { useTransaction } from "state/transactions/hooks"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import theme from "theme"

interface IProps {
  hash: string
  onClose: () => void
  visible: boolean
}

const ToastTransaction: FC<IProps> = ({ hash, onClose, visible }) => {
  const { chainId } = useActiveWeb3React()
  const tx = useTransaction(hash)

  const type = useMemo<ToastType>(() => {
    if (!tx || !tx.receipt) {
      return ToastType.Waiting
    }

    if (Boolean(tx.receipt && tx.receipt.status === 1)) {
      return ToastType.Success
    }

    return ToastType.Warning
    /*
      No need dependency, otherwise React will
      re-render content of 'wait toast' after transaction is confirmed
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const body = useMemo(() => {
    if (!tx) return null

    switch (type) {
      case ToastType.Waiting:
        return <TransactionWait info={tx.info} addedTime={tx.addedTime} />
      case ToastType.Success:
        return <TransactionSummary info={tx.info} />
      case ToastType.Warning:
        return (
          <TransactionErrorContent>
            Your transaction didn&apos;t send to the network
          </TransactionErrorContent>
        )
      default:
        return null
    }
    /*
      No need dependency, otherwise React will
      re-render content of 'wait toast' after transaction is confirmed
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!tx) return null

  return (
    <>
      <ToastBase type={type} onClose={onClose} visible={visible}>
        {type !== ToastType.Waiting && chainId ? (
          <>
            <ExternalLink
              color={theme.textColors.primary}
              iconColor={theme.textColors.primary}
              href={getExplorerLink(
                chainId,
                hash,
                ExplorerDataType.TRANSACTION
              )}
            >
              <TransactionBody>{body}</TransactionBody>
            </ExternalLink>
          </>
        ) : (
          <TransactionBody>{body}</TransactionBody>
        )}
      </ToastBase>
    </>
  )
}

export default ToastTransaction
