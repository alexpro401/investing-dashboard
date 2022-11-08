import * as React from "react"
import { v4 as uuidv4 } from "uuid"
import { isEmpty, map } from "lodash"
import { PulseSpinner } from "react-spinners-kit"

import { Indents } from "./styled"

import { Text, To } from "theme"
import { Card } from "common"

const DaoPoolsListFiltered = ({ loading, pools }) => {
  return React.useMemo<JSX.Element>(() => {
    if (loading && isEmpty(pools)) {
      return <PulseSpinner />
    }

    if (!loading && isEmpty(pools)) {
      return <Text color="#B1C7FC">No DAO pools</Text>
    }

    return (
      <>
        {map(pools, (pool) => (
          <To key={uuidv4()} to={`/dao/${pool.id}`}>
            <Indents>
              <Card>
                <Text>Pool card</Text>
              </Card>
            </Indents>
          </To>
        ))}
      </>
    )
  }, [loading, pools])
}

export default DaoPoolsListFiltered
