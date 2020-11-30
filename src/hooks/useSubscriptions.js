import { useState, useRef, useCallback, useEffect } from 'react'
import { useAppState } from '../providers/AppState'
import {
  transformConfigData,
  transformContributionData,
} from '../utils/data-transform-utils'

export const useConfigSubscription = presaleConnector => {
  const [config, setConfig] = useState(null)

  const rawConfigRef = useRef(null)
  const configSubscription = useRef(null)

  const onConfigHandler = useCallback((err, config) => {
    if (err || !config) {
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
    if (!presaleConnector) {
      return
    }

    configSubscription.current = presaleConnector.onConfig(onConfigHandler)

    return () => configSubscription.current.unsubscribe()
  }, [presaleConnector, onConfigHandler])

  return config
}

export const useContributionsSubscription = () => {
  const { presaleConnector } = useAppState()
  const [contributions, setContributions] = useState([])

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
      // TODO: Add pagination and remove hard-coded value
      { first: 1000, skip: 0 },
      onContributionsHandler
    )
    return () => {
      contributionsSubscription.current.unsubscribe()
    }
  }, [presaleConnector, onContributionsHandler])

  return contributions
}
