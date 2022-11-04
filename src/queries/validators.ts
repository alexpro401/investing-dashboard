const VALIDATOR = `
  id
  balance
`

const DaoPoolValidatorsQuery = `
  query($address: String!) {
    daoPools(where: { id: $address }) {
      validators {
        ${VALIDATOR}
      }
    }
  }
`

export { DaoPoolValidatorsQuery }
