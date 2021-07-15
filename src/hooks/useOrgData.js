import { useState, useEffect } from 'react'
import { useApp, useOrganization } from '@1hive/connect-react'

import connectHatch from '@commonsswarm/connect-hatch'
import { useConfigSubscription } from './useSubscriptions'

const REDEMPTIONS_APP_NAME = 'redemptions'
const APP_NAME = process.env.REACT_APP_HATCH_APP_NAME
const STAGING = process.env.REACT_APP_STAGING === 'true' ?? false

const useOrgData = () => {
  const [hatchConnector, setHatchConnector] = useState(null)
  const [organization, orgStatus] = useOrganization()
  const [hatchApp, hatchStatus] = useApp(APP_NAME)
  const [redemptionsApp, redemptionsStatus] = useApp(REDEMPTIONS_APP_NAME)

  useEffect(() => {
    if (!hatchApp) {
      return
    }

    let cancelled = false

    const fetchHatchConnector = async () => {
      try {
        const hatchConnector = await connectHatch(hatchApp, [
          'thegraph',
          { staging: STAGING },
        ])

        if (!cancelled) {
          setHatchConnector(hatchConnector)
        }
      } catch (err) {
        console.error(`Error fetching hatch connector: ${err}`)
      }
    }

    fetchHatchConnector()

    return () => {
      cancelled = true
    }
  }, [hatchApp])

  const config = useConfigSubscription(hatchConnector)

  const loadingData =
    orgStatus.loading ||
    hatchStatus.loading ||
    redemptionsStatus.loading ||
    !config

  const errors = orgStatus.error || hatchStatus.error || redemptionsStatus.error

  return {
    config,
    errors,
    hatchConnector,
    hatchApp,
    redemptionsApp,
    organization,
    loadingAppData: loadingData,
  }
}

export default useOrgData
