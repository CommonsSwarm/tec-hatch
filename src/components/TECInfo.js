import React from 'react'
import styled from 'styled-components'
import {
  Link,
  GU,
  textStyle,
  useLayout,
  Details as RawDetails,
} from '@commonsswarm/ui'

const TECInfo = () => {
  const { layoutName } = useLayout()

  return (
    <div
      css={`
        display: flex;
        justify-content: center;
        align-items: ${layoutName === 'small' ? 'center' : 'flex-start'};
        flex-direction: column;
        padding: 0 ${GU};
      `}
    >
      <Title>Hatching a New Economy</Title>
      <Paragraph>
        Welcome! Our{' '}
        <Link href="https://medium.com/token-engineering-commons/the-token-engineering-commons-hatch-your-economy-your-choice-354926284281">
          Hatch
        </Link>{' '}
        is open{' '}
        <Link href="https://medium.com/commonsstack/join-the-commons-stacks-trusted-seed-swiss-association-ed51a356cb6c">
          active Trusted Seed members
        </Link>{' '}
        for and builders of the Token Engineering Commons!
      </Paragraph>
      <Paragraph>
        The vision of the <strong>Token Engineering Commons (TEC)</strong> is to
        advance the field of token engineering by creating ethical, safe,
        resilient and diverse economic systems to benefit societies around the
        world.
      </Paragraph>
      <Paragraph>
        In the short term, the goal of the TEC is to fund proposals to build out
        token engineering public goods. In the long term, the goal is to expand
        the frontiers of the token engineering field and have the TEC as an
        advisory body, protecting public interest.
      </Paragraph>
      <Paragraph>
        We are curating a rich community culture built on the principles of
        integrity, trust and communication. We encourage members to be radically
        open source and support the collective, prioritizing the advancement of
        token engineering over short-term profits.
      </Paragraph>
      <Paragraph>
        We believe that our{' '}
        <Link href="https://token-engineering-commons.gitbook.io/tec-handbook/what-is-the-tec/mission-vision-and-values">
          prosocial, human-centered perspective
        </Link>{' '}
        and our diverse community of experienced contributors truly has the
        potential to revolutionize global economic systems.{' '}
        <strong>
          The future of token engineering is upon us, and your chance to get
          involved is NOW.
        </strong>
      </Paragraph>
      <Paragraph>
        We’re happy to have you here; let’s advance token engineering!
      </Paragraph>
      <Paragraph>
        <strong>Welcome to the TEC Hatch.</strong>
      </Paragraph>
      <Title>Frequently Asked Questions</Title>
      <Details label="How does the Hatch work?">
        During the Hatch period, legal members of the Trusted Seed (CSTK token
        holders) can send wxDai to mint TEC-Hatch (TECH) tokens. There is a
        Minimum Goal that needs to be reached in order for the TEC hatch to be
        successful. If that amount of wxDai is not collected, the Hatch fails
        and 100% of the funds are returned. If the Minimum Goal is reached or
        surpassed, one week after of the Hatch period, TECH holders will be able
        to vote for and ratify the Commons Upgrade parameters. For more details,
        click{' '}
        <Link href="https://forum.tecommons.org/t/the-hatch-tl-dr/272">
          here
        </Link>
        .
      </Details>
      <Details label="What is wxDai?">
        wxDai is the token that Hatchers are required to send in order to
        participate in the Hatch. wxDai is the wrapped, ERC-20 tokenized, copy
        of the xDai stable coin that exists on the xDai network Ethereum
        sidechain. For a step-by-step guide on how to get wxDai, check out our
        forum post{' '}
        <Link href="https://forum.tecommons.org/t/how-to-get-wxdai-a-bridging-story/347">
          here
        </Link>
        . If you still have some questions or need further assistance for
        getting wxDai, feel free to ask in our{' '}
        <Link href="https://discord.gg/8eCYn5EzjZ">Discord Server</Link>.
      </Details>
      <Details label="How does the HatchDAO work?">
        In the HatchDAO, builders and backers will be minted non-transferable
        TECH tokens proportionately according to their contributions. They will
        be able to use their tokens to vote via{' '}
        <Link href="https://www.notion.so/Technical-Documentation-2dea29d0a3014e6db22d8f17cf93e7d1">
          Dandelion Voting
        </Link>
        . You can read more about the HatchDAO in this{' '}
        <Link href="https://i.imgur.com/3F0iUDm.png">infographic</Link>.
      </Details>
      <Details label="What if you want to exit the HatchDAO?">
        Participants can exit the HatchDAO by "ragequitting": effectively
        withdrawing their funds from the future Commons, minus a non-redeemable
        percentage (the Hatch Tribute and the Cultural Build Tribute).
        Ragequitting can be done any time starting one week after the hatch
        success and before the Commons Upgrade, provided that tokens are not
        actively voting on proposals. To read more about ragequitting, click{' '}
        <Link href="https://forum.tecommons.org/t/ragequitting-ragequit-delay-and-how-they-work/130?u=chuygarcia92">
          here
        </Link>
        .
      </Details>
      <Details label="What is the Commons Upgrade?">
        The Commons Upgrade will be the starting point of the TEC Commons. The
        whole purpose of the HatchDAO is to design the economy of the Commons
        Upgrade. The upgrade will include the launching of an Augmented Bonding
        Curve (ABC) for the TEC token, and Disputable Conviction Voting.
        Participants of the HatchDAO will have their TECH tokens converted into
        TEC governance tokens, whose value is determined by the ABC. The token
        will be transferrable and the general public will be able to buy and
        sell TEC tokens against the bonding curve. To learn more about the
        Commons Upgrade, click{' '}
        <Link href="https://forum.tecommons.org/t/how-you-can-hatch-the-tec/328">
          here
        </Link>
        .
      </Details>
    </div>
  )
}

const Title = ({ children }) => {
  const { layoutName } = useLayout()

  return (
    <div
      css={`
        ${textStyle('title4')};
        align-self: flex-start;
        margin: ${3 * GU}px ${layoutName === 'small' ? 1.5 * GU : 0}px;
        font-weight: bold;
      `}
    >
      {children}
    </div>
  )
}

const Details = ({ label, children }) => {
  const { layoutName } = useLayout()

  return (
    <RawDetails
      css={`
        margin: 0 ${layoutName === 'small' ? 2 * GU : 0}px;
      `}
      label={label}
    >
      <Paragraph>{children}</Paragraph>
    </RawDetails>
  )
}

const Paragraph = styled.div`
  margin: ${1 * GU}px 0;
  width: ${({ layout }) => (layout === 'small' ? 100 : 90)}%;
  ${textStyle('body2')};
`

export default TECInfo
