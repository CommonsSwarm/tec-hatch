import React from 'react'
import {
  ButtonBase,
  GU,
  IconDown,
  useTheme,
  useViewport,
} from '@commonsswarm/ui'

const HeaderModule = ({ content, hasPopover = true, icon, onClick }) => {
  const { above } = useViewport()
  const theme = useTheme()

  return (
    <ButtonBase
      onClick={onClick}
      css={`
        height: 100%;
        padding: ${1 * GU}px;
        background: ${theme.surfaceContentAuxiliar};
        &:active {
          background: ${theme.surfaceContentAuxiliar.alpha(0.5)};
        }
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          text-align: left;
          padding: 0 ${1 * GU}px;
        `}
      >
        <>
          {icon}
          {above('medium') && (
            <>
              <div
                css={`
                  padding-left: ${1 * GU}px;
                  padding-right: ${0.5 * GU}px;
                `}
              >
                {content}
              </div>
              {hasPopover && (
                <IconDown
                  size="small"
                  css={`
                    color: ${theme.surfaceIcon};
                  `}
                />
              )}
            </>
          )}
        </>
      </div>
    </ButtonBase>
  )
}

export default HeaderModule
