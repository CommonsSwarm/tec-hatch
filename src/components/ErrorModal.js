import React from 'react'
import { GU, Modal, textStyle, useViewport } from '@commonsswarm/ui'
import ConnectionError from '../assets/ConnectionError.svg'

const ErrorModal = ({ visible }) => {
  const { width } = useViewport()

  return (
    <Modal
      closeButton={false}
      padding={7 * GU}
      visible={visible}
      width={Math.min(55 * GU, width - 40)}
    >
      <div
        css={`
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        `}
      >
        <img src={ConnectionError} alt="Connection error icon" width={140} />
        <h3
          css={`
            ${textStyle('title2')}
            margin-top: 24px;
            margin-bottom: 8px;
          `}
        >
          Something went wrong
        </h3>
        <h4
          css={`
            ${textStyle('body3')}
          `}
        >
          An error has occurred with the network connection.
        </h4>
      </div>
    </Modal>
  )
}

export default ErrorModal
