import { useState, useRef, useCallback, useEffect } from 'react'
import { useAppState } from '../providers/AppState'
import {
  transformConfigData,
  transformContributionData,
  transformContributorData,
} from '../utils/data-transform-utils'

export const useConfigSubscription = hatchConnector => {
  const [config, setConfig] = useState(null)
  const rawConfigRef = useRef(null)
  const configSubscription = useRef(null)

  const onConfigHandler = useCallback(async (err, config) => {
    if (err || !config) {
      console.error(err)
      return
    }

    const rawConfig = JSON.stringify(config)

    if (rawConfigRef && rawConfigRef.current === rawConfig) {
      return
    }

    rawConfigRef.current = rawConfig
    const transformedConfig = transformConfigData(config)

    setConfig(transformedConfig)
  }, [])

  useEffect(() => {
    if (!hatchConnector) {
      return
    }

    configSubscription.current = hatchConnector.onGeneralConfig(onConfigHandler)

    return () => configSubscription.current.unsubscribe()
  }, [hatchConnector, onConfigHandler])

  return config
}

export const useContributorsSubscription = ({
  count = 1000,
  skip = 0,
  orderBy = 'totalValue',
  orderDirection = 'asc',
} = {}) => {
  const {
    hatchConnector,
    config: {
      hatchConfig: { contributionToken, token },
    },
  } = useAppState()
  const [contributors, setContributors] = useState([])

  const contributorsSubscription = useRef(null)

  const onContributorsHandler = useCallback(
    (err, contributors = []) => {
      if (err || !contributors) {
        return
      }

      const transformedContributors = contributors.map(c =>
        transformContributorData(c, contributionToken, token)
      )

      setContributors(transformedContributors)
    },
    [contributionToken, token]
  )

  useEffect(() => {
    if (!hatchConnector) {
      return
    }

    contributorsSubscription.current = hatchConnector.onContributors(
      { first: count, skip, orderBy, orderDirection },
      onContributorsHandler
    )
    return () => {
      contributorsSubscription.current.unsubscribe()
    }
  }, [
    hatchConnector,
    onContributorsHandler,
    count,
    skip,
    orderBy,
    orderDirection,
  ])

  return contributors
}

export const useContributorSubscription = contributorAccount => {
  const { hatchConnector, config } = useAppState()
  const { contributionToken, token } = config?.hatchConfig || {}
  const [contributor, setContributor] = useState(null)
  const [loading, setLoading] = useState(true)

  const contributorSubscription = useRef(null)
  const rawContributorRef = useRef(null)

  const clearContributor = () => {
    setContributor(null)
    rawContributorRef.current = null
  }

  const onContributorHandler = useCallback(
    async (err, contributor) => {
      if (err || !contributor) {
        clearContributor()
        setLoading(false)
        return
      }

      const rawContributor = JSON.stringify(contributor)

      if (rawContributorRef && rawContributor === rawContributorRef.current) {
        return
      }

      const transformedContributor = transformContributorData(
        contributor,
        contributionToken,
        token
      )
      rawContributorRef.current = rawContributor

      setContributor(transformedContributor)
      setLoading(false)
    },
    [contributionToken, token]
  )

  useEffect(() => {
    if (!hatchConnector || !contributorAccount) {
      setContributor(null)
      rawContributorRef.current = null

      return
    }

    contributorSubscription.current = hatchConnector.onContributor(
      contributorAccount,
      onContributorHandler
    )
    return () => {
      contributorSubscription.current.unsubscribe()
    }
  }, [hatchConnector, contributorAccount, onContributorHandler])

  return [contributor, loading]
}

export const useContributionsSubscription = ({
  contributor = '',
  count = 1000,
  skip = 0,
  orderBy = 'value',
  orderDirection = 'desc',
} = {}) => {
  const { hatchConnector } = useAppState()
  const [contributions, setContributions] = useState([])

  const contributionsSubscription = useRef(null)

  const onContributionsHandler = useCallback((err, contributions = []) => {
    if (err || !contributions) {
      return
    }

    const transformedContributions = contributions.map(c =>
      transformContributionData(c)
    )

    setContributions(transformedContributions)
  }, [])

  useEffect(() => {
    if (!hatchConnector || !contributor) {
      setContributions([])
      return
    }
    contributionsSubscription.current = hatchConnector.onContributions(
      { contributor, first: count, skip, orderBy, orderDirection },
      onContributionsHandler
    )
    return () => {
      contributionsSubscription.current.unsubscribe()
    }
  }, [
    hatchConnector,
    onContributionsHandler,
    contributor,
    count,
    skip,
    orderBy,
    orderDirection,
  ])

  return contributions
}
