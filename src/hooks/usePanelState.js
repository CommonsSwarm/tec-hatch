import { useCallback, useMemo, useState } from 'react'

const usePanelState = () => {
  const [visible, setVisible] = useState(false)

  const requestOpen = useCallback(() => {
    setVisible(true)
  }, [setVisible])

  const requestClose = useCallback(() => {
    setVisible(false)
  }, [setVisible])

  return useMemo(() => ({ requestOpen, requestClose, visible }), [
    requestOpen,
    requestClose,
    visible,
  ])
}

export default usePanelState
