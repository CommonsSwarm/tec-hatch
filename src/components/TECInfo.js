import React from 'react'
import styled from 'styled-components'
import { Link, GU, textStyle } from '@tecommons/ui'

const TECInfo = () => {
  const miroUrl = 'https://miro.medium.com/max/700/0*f1EsD1L-1_cTmTos'
  const codeOfConductUrl =
    'https://docs.google.com/document/d/1S5EoWbsFt3uQ5Wj6yyUJKyApFyjCQ-EloZAr6W55N3U/edit#'

  return (
    <div>
      <Title>To·ken En·gi·neer·ing /ˈtoʊkən/ /ˌendʒɪˈnɪərɪŋ/</Title>
      <Paragraph>
        <ol>
          <li>
            An emerging engineering discipline focused on holistic systems
            design and the theory, practice and tools used to design and verify
            tokenized ecosystems i.e. cryptoeconomic systems and their
            simulation using tools like cadCAD.
          </li>
          <li>
            A discipline of responsibility; adhering to the highest principles
            of ethical conduct (from ethical engineering).
          </li>
          <li>
            A community pushing forward the field of token engineering in theory
            and practice. (See more Modeling Crypto Protocols as Complex
            Systems, TE Process).
          </li>
        </ol>
      </Paragraph>
      <Title>Com·mons /ˈkɒmənz/</Title>
      <Paragraph>
        <ol>
          <li>
            Resources that groups of people (communities, organizations) create
            and manage for individual and collective benefit. These resources
            are held collectively, not owned privately (see Fractar Ownership,
            Wiki and Automating Ostrom).
          </li>
        </ol>
      </Paragraph>
      <Title>Vision &amp; Mission</Title>
      <Paragraph>
        A few co-creative sessions were held to identify the TEC Vision, Mission
        and Values using this Miro, followed by a-sync work and voting on the
        Discord Channel.
      </Paragraph>
      <Paragraph>
        <ImageWrapper>
          <img
            css={`
              width: 65%;
            `}
            src={miroUrl}
          />
        </ImageWrapper>
      </Paragraph>
      <Title>Values</Title>
      <Paragraph>
        The TEC operates from a prosocial human centered perspective. We hold
        ourselves to high standards of safety, resilience, and integrity. We
        encourage our members to be radically open source, non-hierarchical,
        creative, transparent in their intentions and accountable for their
        actions. We are value driven, (non profit driven) and will strive to
        support token engineering projects that appreciate the value of public
        goods and ethical, inclusive economic systems. (See also, the{' '}
        <Link href={codeOfConductUrl} target="_blank" rel="noreferrer">
          TEC Code of Conduct
        </Link>
        ).
      </Paragraph>
    </div>
  )
}

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: ${4 * GU}px;
  margin-bottom: ${4 * GU}px;
`
const Title = styled.div`
  ${textStyle('title4')};
  margin-top: ${4 * GU}px;
  margin-bottom: ${4 * GU}px;
  font-weight: 800;
`

const Paragraph = styled.div`
  margin-top: ${2 * GU}px;
  margin-bottom: ${2 * GU}px;
  ${textStyle('body2')};
`
export default TECInfo
