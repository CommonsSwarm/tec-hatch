import { useAppState } from '../providers/AppState'
import useActions from './useActions'
import { useContributionsSubscription } from './useSubscriptions'

export const useAppLogic = () => {
  const { config, errors, isLoading } = useAppState()
  const actions = useActions(() => {}) // TODO: Pass closePanel function
  const contributions = useContributionsSubscription()

  return {
    actions,
    config,
    contributions,
    isLoading: isLoading,
    errors,
  }
}
