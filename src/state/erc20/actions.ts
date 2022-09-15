import { createAction } from "@reduxjs/toolkit"
import { Token } from "interfaces"

interface IAddTokenPayload extends Token {
  chainId: number
}

interface IRemoveTokenPayload {
  chainId: number
  address: string
}

export const addToken = createAction<{ params: IAddTokenPayload }>(
  "erc20/add-token"
)

export const removeToken = createAction<{ params: IRemoveTokenPayload }>(
  "erc20/remove-token"
)
