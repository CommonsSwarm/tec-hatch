import { useState, useRef, useCallback, useEffect } from 'react'
import { useAppState } from '../providers/AppState'
import {
  transformConfigData,
  transformContributionData,
  transformContributorData,
} from '../utils/data-transform-utils'
import { useContract } from './useContract'
import presaleAbi from '../abi/Presale.json'
import { Presale } from '../constants'

export const useConfigSubscription = presaleConnector => {
  const [config, setConfig] = useState(null)
  const presaleAddress = presaleConnector?.address
  const presale = useContract(presaleAddress, presaleAbi, true)
  const rawConfigRef = useRef(null)
  const configSubscription = useRef(null)

  const onConfigHandler = useCallback(
    async (err, config) => {
      if (err || !config) {
        return
      }

      /**
       * Need to fetch hatch state because contract state
       * variable is not updated when hatch period is over.
       */
      const intState = await presale.methods.state().call()

      config.state = Presale.intState[intState]

      const rawConfig = JSON.stringify(config)
      if (rawConfigRef && rawConfigRef.current === rawConfig) {
        return
      }

      rawConfigRef.current = rawConfig
      const transformedConfig = transformConfigData(config)

      setConfig(transformedConfig)
    },
    [presale]
  )

  useEffect(() => {
    if (!presaleConnector) {
      return
    }

    configSubscription.current = presaleConnector.onConfig(onConfigHandler)

    return () => configSubscription.current.unsubscribe()
  }, [presaleConnector, onConfigHandler])

  return config
}

export const useContributorsSubscription = ({
  count = 1000,
  skip = 0,
  orderBy = 'totalValue',
  orderDirection = 'asc',
} = {}) => {
  const {
    presaleConnector,
    config: { contributionToken, token },
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
    if (!presaleConnector) {
      return
    }

    contributorsSubscription.current = presaleConnector.onContributors(
      { first: count, skip, orderBy, orderDirection },
      onContributorsHandler
    )
    return () => {
      contributorsSubscription.current.unsubscribe()
    }
  }, [
    presaleConnector,
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
    presaleConnector,
    config: { contributionToken, token },
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
    if (!presaleConnector || !contributorAccount) {
      setContributor(null)
      return
    }

    contributorSubscription.current = presaleConnector.onContributor(
      contributorAccount,
      onContributorHandler
    )
    return () => {
      contributorSubscription.current.unsubscribe()
    }
  }, [presaleConnector, contributorAccount, onContributorHandler])

  return contributor
}

export const useContributionsSubscription = ({
  contributor = '',
  count = 1000,
  skip = 0,
  orderBy = 'value',
  orderDirection = 'desc',
} = {}) => {
  const { presaleConnector } = useAppState()
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
    if (!presaleConnector || !contributor) {
      setContributions([])
      return
    }
    contributionsSubscription.current = presaleConnector.onContributions(
      { contributor, first: count, skip, orderBy, orderDirection },
      onContributionsHandler
    )
    return () => {
      contributionsSubscription.current.unsubscribe()
    }
  }, [
    presaleConnector,
    onContributionsHandler,
    contributor,
    count,
    skip,
    orderBy,
    orderDirection,
  ])

  return contributions
}
