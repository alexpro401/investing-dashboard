import React from "react"

import { useActiveWeb3React } from "hooks"
import useIsValidator from "hooks/useIsValidator"
import Page404 from "components/Page404"

import image404Src from "assets/others/create-fund-docs.png"

interface IProps {
  daoPoolAddress: string
  children: React.ReactNode
  loader?: React.ReactNode
}

const WithUserIsDaoValidatorValidation: React.FC<IProps> = ({
  daoPoolAddress,
  children,
  loader,
}) => {
  const { account } = useActiveWeb3React()
  const [isValid, loading] = useIsValidator({
    daoAddress: daoPoolAddress,
    userAddress: account ?? "",
  })

  if (loading) {
    return <>{loader ?? ""}</>
  }

  if (!isValid) {
    return (
      <Page404
        title={"Not found"}
        text={`Your account (${account}) is not a validator in DAO pool with address: ${daoPoolAddress}`}
        renderImage={<img src={image404Src} alt="" />}
      />
    )
  }

  return <>{children}</>
}

export default WithUserIsDaoValidatorValidation
