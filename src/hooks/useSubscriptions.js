import { useState, useRef, useCallback, useEffect } from 'react'
import { useAppState } from '../providers/AppState'
import {
  transformConfigData,
  transformContributionData,
} from '../utils/data-transform-utils'
import { useContract } from './useContract'
import presaleAbi from '../abi/Presale.json'
import { Presale } from '../constants'
const PRESALE_ADDRESS = process.env.REACT_APP_PRESALE_APP_ADDRESS

export const useConfigSubscription = presaleConnector => {
  const [config, setConfig] = useState(null)
  const presale = useContract(PRESALE_ADDRESS, presaleAbi, true)
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

export const useContributionsSubscription = ({
  contributor = '',
  count = 1000,
  skip = 0,
  orderBy = 'contributor',
  orderDirection = 'asc',
} = {}) => {
  const { presaleConnector } = useAppState()
  const [contributions, setContributions] = useState(new Map())

  const contributionsSubscription = useRef(null)

  const onContributionsHandler = useCallback((err, contributions = []) => {
    if (err || !contributions) {
      return
    }

    const transformedContributions = contributions.reduce(
      (contributionsMap, c) => {
        const transformedC = transformContributionData(c)
        const key = transformedC.contributor
        if (contributionsMap.has(key)) {
          const userContributions = contributionsMap.get(key)
          userContributions.push(transformedC)
          contributionsMap.set(key, userContributions)
        } else {
          contributionsMap.set(key, [transformedC])
        }

        return contributionsMap
      },
      new Map()
    )
    setContributions(transformedContributions)
  }, [])

  useEffect(() => {
    if (!presaleConnector) {
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
