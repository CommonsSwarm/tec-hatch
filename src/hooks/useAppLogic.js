import { useContributionsSubscription } from './useSubscriptions'

export const useAppLogic = () => {
  const contributions = useContributionsSubscription()

  return {
    contributions,
  }
}
