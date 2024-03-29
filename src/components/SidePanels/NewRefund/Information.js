import React from 'react'
import { Info, GU } from '@commonsswarm/ui'

export default () => {
  return (
    <div
      css={`
        margin-top: ${4 * GU}px;
      `}
    >
      <Info.Action>
        The hatch did not reach its goal. You can thus request refund for your
        contributions. If you have made multiple contributions, you should
        request refund for each of them.
      </Info.Action>
    </div>
  )
}
