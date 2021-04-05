import { useState, useEffect } from 'react'
import { useApp, useApps, useOrganization } from '@aragon/connect-react'

import connectHatch from '@tecommons/connect-hatch'
import { useConfigSubscription } from './useSubscriptions'

const APP_NAME = process.env.REACT_APP_HATCH_APP_NAME
const STAGING = process.env.REACT_APP_STAGING ?? false

const useOrgData = () => {
  const [hatchConnector, setHatchConnector] = useState(null)
  const [organization, orgStatus] = useOrganization()
  const [apps, appsStatus] = useApps()
  const [hatchApp] = useApp(APP_NAME)

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

  const loadingData = orgStatus.loading || appsStatus.loading || !config

  const errors = orgStatus.error || appsStatus.error

  return {
    config,
    errors,
    hatchConnector,
    installedApps: apps,
    hatchApp,
    organization,
    loadingAppData: loadingData,
  }
}

export default useOrgData
