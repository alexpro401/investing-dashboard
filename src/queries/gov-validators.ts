const VALIDATOR = `
  id
  balance
`

export const DaoPoolValidatorsQuery = `
  query($address: String!) {
    daoPools(where: { id: $address }) {
      validators {
        ${VALIDATOR}
      }
    }
  }
`

export const DaoPoolDaoProfileValidatorsQuery = `
  query($offset: Int!, $limit: Int!, $address: String!) {
    daoPool(id: $address) {
      validators(skip: $offset, first: $limit, orderBy: balance, orderDirection: desc) {
        id
        balance
      }
    }
  }
`
