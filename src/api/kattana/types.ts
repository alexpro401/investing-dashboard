interface ITreasuryToken {
  balance: string
  balance_24h: string
  contract_address: string
  contract_decimals: number
  contract_name: string
  contract_ticker_symbol: string
  last_transferred_at: string | null
  logo_url: string
  nft_data: null
  quote: number
  quote_24h: number
  quote_rate: number
  quote_rate_24h: number
  supports_erc: string[] | null
  type: string
}

export interface ITreasuryTokensList {
  address: string
  chain_id: number
  items: ITreasuryToken[]
  next_update_at: string
  pagination: null
  quote_currency: string
  updated_at: string
}
