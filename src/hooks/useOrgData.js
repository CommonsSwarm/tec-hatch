import { useState, useEffect, useMemo } from 'react'
import {
  useApp,
  useApps,
  useOrganization,
  usePermissions,
} from '@aragon/connect-react'

import connectPresale from '@tecommons/connect-hatch'
import { addressesEqual } from '../utils/web3-utils'
import { useConfigSubscription } from './useSubscriptions'

const APP_NAME = process.env.REACT_APP_PRESALE_APP_NAME

const useOrgData = () => {
  const [presaleConnector, setPresaleConnector] = useState(null)
  const [organization, orgStatus] = useOrganization()
  const [apps, appsStatus] = useApps()
  const [presaleApp] = useApp(APP_NAME)
  const [permissions, permissionsStatus] = usePermissions()
  const presaleAppPermissions = useMemo(() => {
    if (
      !permissions ||
      permissionsStatus.loading ||
      permissionsStatus.error ||
      !presaleApp
    ) {
      return
    }
    return permissions.filter(({ appAddress }) =>
      addressesEqual(appAddress, presaleApp.address)
    )
  }, [presaleApp, permissions, permissionsStatus])

  useEffect(() => {
    if (!presaleApp) {
      return
    }

    let cancelled = false

    const fetchPresaleConnector = async () => {
      try {
        const presaleConnector = await connectPresale(presaleApp)

        if (!cancelled) {
          setPresaleConnector(presaleConnector)
        }
      } catch (err) {
        console.error(`Error fetching presale connector: ${err}`)
      }
    }

    fetchPresaleConnector()

    return () => {
      cancelled = true
    }
  }, [presaleApp])

  const config = useConfigSubscription(presaleConnector)

  const loadingData =
    orgStatus.loading ||
    appsStatus.loading ||
    permissionsStatus.loading ||
    !config

  const errors = orgStatus.error || appsStatus.error || permissionsStatus.error

  return {
    config,
    errors,
    presaleConnector,
    installedApps: apps,
    presaleApp,
    organization,
    permissions: presaleAppPermissions,
    loadingAppData: loadingData,
  }
}

export default useOrgData
