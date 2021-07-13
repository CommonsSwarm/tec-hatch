import React, { useState } from 'react'
import { GU, textStyle, Button } from '@commonsswarm/ui'
import HatchTerms from '../assets/TEC_Hatch_Terms.pdf'
import { useUserState } from '../providers/UserState'
import { useAppState } from '../providers/AppState'

function TermsAgreement(props) {
  const [agree, setAgree] = useState(false)

  const checkboxHandler = () => {
    setAgree(!agree)
  }
  const { account } = useUserState()
  const {
    config: {
      hatchConfig: {
        token: { symbol: tokenSymbol },
      },
    },
    contributionPanel: { requestOpen: requestContributionOpen },
  } = useAppState()
  return (
    <div>
      <div>
        <Button
          wide
          mode="normal"
          label={`Mint ${tokenSymbol}`}
          onClick={requestContributionOpen}
          disabled={!account || !agree}
        />
      </div>
      <div
        css={`
          width: 100%;
          color: white;
          ${textStyle('body2')}
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: ${2 * GU}px;
          margin-bottom: ${0.1 * GU}px;
        `}
      >
        <input type="checkbox" id="agree" onChange={checkboxHandler} />
        <label>
          I agree to the{' '}
          <a target="_blank" rel="noopener noreferrer" href={HatchTerms}>
            terms & conditions
          </a>
        </label>
      </div>
    </div>
  )
}

export default TermsAgreement
