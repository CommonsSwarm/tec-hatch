import { useState, useEffect, useMemo } from 'react'
import {
  useApp,
  useApps,
  useOrganization,
  usePermissions,
} from '@aragon/connect-react'

import connectHatch from '@tecommons/connect-hatch'
import { addressesEqual } from '../utils/web3-utils'
import { useConfigSubscription } from './useSubscriptions'

const APP_NAME = process.env.REACT_APP_HATCH_APP_NAME

const useOrgData = () => {
  const [hatchConnector, setHatchConnector] = useState(null)
  const [organization, orgStatus] = useOrganization()
  const [apps, appsStatus] = useApps()
  const [hatchApp] = useApp(APP_NAME)
  const [permissions, permissionsStatus] = usePermissions()
  const hatchAppPermissions = useMemo(() => {
    if (
      !permissions ||
      permissionsStatus.loading ||
      permissionsStatus.error ||
      !hatchApp
    ) {
      return
    }
    return permissions.filter(({ appAddress }) =>
      addressesEqual(appAddress, hatchApp.address)
    )
  }, [hatchApp, permissions, permissionsStatus])

  useEffect(() => {
    if (!hatchApp) {
      return
    }

    let cancelled = false

    const fetchHatchConnector = async () => {
      try {
        const hatchConnector = await connectHatch(hatchApp)

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
    appsStatus.loading ||
    permissionsStatus.loading ||
    !config

  const errors = orgStatus.error || appsStatus.error || permissionsStatus.error

  return {
    config,
    errors,
    hatchConnector,
    installedApps: apps,
    hatchApp,
    organization,
    permissions: hatchAppPermissions,
    loadingAppData: loadingData,
  }
}

export default useOrgData
