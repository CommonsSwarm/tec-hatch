import { useState, useRef, useCallback, useEffect } from 'react'
import { useAppState } from '../providers/AppState'
import {
  transformConfigData,
  transformContributionData,
  transformContributorData,
} from '../utils/data-transform-utils'
import { useContract } from './useContract'
import hatchAbi from '../abis/Hatch.json'
import { Hatch } from '../constants'

export const useConfigSubscription = hatchConnector => {
  const [config, setConfig] = useState(null)
  const hatchAddress = hatchConnector?.address
  const hatch = useContract(hatchAddress, hatchAbi, true)
  const rawConfigRef = useRef(null)
  const configSubscription = useRef(null)

  const onConfigHandler = useCallback(
    async (err, config) => {
      if (err || !config) {
        console.error(err)
        return
      }

      /**
       * Need to fetch hatch state because contract state
       * variable is not updated when hatch period is over.
       */
      const intState = await hatch.methods.state().call()

      config.hatchConfig.state = Hatch.intState[intState]

      const rawConfig = JSON.stringify(config)

      if (rawConfigRef && rawConfigRef.current === rawConfig) {
        return
      }

      rawConfigRef.current = rawConfig
      const transformedConfig = transformConfigData(config)

      setConfig(transformedConfig)
    },
    [hatch]
  )

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

export const useContributorSubscription = ({
  contributor: contributorAccount,
}) => {
  const {
    hatchConnector,
    config: {
      hatchConfig: { contributionToken, token },
    },
  } = useAppState()
  const [contributor, setContributor] = useState(null)
  const contributorSubscription = useRef(null)
  const rawContributorRef = useRef(null)

  const onContributorHandler = useCallback(
    (err, contributor) => {
      if (err || !contributor) {
        setContributor(null)
        return
      }

      const rawContributor = JSON.stringify(contributor)

      if (
        rawContributorRef.current &&
        rawContributor === rawContributorRef.current
      ) {
        return
      }

      const transformedContributor = transformContributorData(
        contributor,
        contributionToken,
        token
      )
      rawContributorRef.current = transformedContributor

      setContributor(transformedContributor)
    },
    [contributionToken, token]
  )

  useEffect(() => {
    if (!hatchConnector || !contributorAccount) {
      setContributor(null)
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

  return contributor
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
