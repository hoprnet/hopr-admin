type FaqElement = {
  id: number;
  title: string;
  content: string | JSX.Element;
};

type FaqData = Record<string, FaqElement[]>;

const nodeFaq: FaqData = {
  '/node/info': [
    {
      id: 1,
      title: 'What version of HOPR should I be running?',
      content: (
        <span>
          You can find the latest version for your device on our docs:
          <br />
          <br />- For{' '}
          <a
            href="https://docs.hoprnet.org/node/using-dappnode"
            target="_blank"
            rel="noreferrer"
          >
            Dappnode
          </a>
          <br />
          <br />- For{' '}
          <a
            href="https://docs.hoprnet.org/node/using-docker"
            target="_blank"
            rel="noreferrer"
          >
            Docker
          </a>
        </span>
      ),
    },
    {
      id: 2,
      title: 'What is an environment?',
      content:
        'Environments contain a set of releases which are compatible. For example, the monte_rosa environment is what all releases between v1.00 and v1.99.00 run in, and within this environment, all nodes running one of these releases can interact with each other.',
    },
    {
      id: 3,
      title: 'How do I make my node eligible?',
      content: (
        <span>
          You must have your node approved to join the network by having an eligible associated staking address and
          being approved by the HOPR association to join the network, as it is currently permissioned. You can join the
          network by creating a safe{' '}
          <a
            href="/staking/onboarding"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          .
        </span>
      ),
    },
    {
      id: 4,
      title: 'How is node health calculated?',
      content: (
        <span>
          It is calculated using the network's heartbeat mechanism.
          <br />
          <br />
          You can read what differentiates each category{' '}
          <a
            href="https://docs.hoprnet.org/node/hoprd-commands#info"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          .
        </span>
      ),
    },
    {
      id: 5,
      title: 'How many tokens should I have on my node?',
      content:
        '0.1 xDAI is plenty to run your node. wxHOPR can be ad-hoc requested from your safe as long as there is a sufficient remaining allowance on your safe, so there is no need to store funds on your safe.',
    },
    {
      id: 6,
      title: 'Why do I need to know token/smart contract addresses?',
      content: 'This is important to verify the authenticity of the contracts.',
    },
    {
      id: 7,
      title: 'What are channels and why do I need them?',
      content:
        'Payment channels are funded connections between two nodes. Without a payment channel open to node X, you cannot use node X to relay data. You want to have a set of well-funded, well-connected channels to and from your node, so it is used for relays and you earn more tickets/wxHOPR.',
    },
    {
      id: 8,
      title: 'What are tickets?',
      content:
        'You earn tickets for relaying data. Each ticket may or may not contain wxHOPR, by using probabilistic payment and aggregating tickets when you redeem them on-chain, it reduces the on-chain transaction fees and exposes less metadata on-chain in comparison to paying directly in wxHOPR.',
    },
    {
      id: 9,
      title: 'Why do I have empty tickets?',
      content:
        'Not all tickets contain wxHOPR, by having some tickets be empty, it reduces the on-chain costs when you redeem one ticket for 2 wxHOPR  vs redeeming two tickets each worth 1 wxHOPR, in which both require xDAI to redeem on chain. Over a large enough amount of tickets, the amount of wxHOPR you earn will converge to what you would have earned if every ticket was winning.',
    },
  ],
  '/node/logs': [
    {
      id: 1,
      title: 'What are these logs for?',
      content:
        'Here you can see the running logs of your node. These are great for real-time information on your node and diagnostic information.',
    },
  ],
  '/node/tickets': [
    {
      id: 1,
      title: 'Why do I have rejected tickets?',
      content:
        'These are tickets that failed network validation and were deemed suspicious. This could be due to a lack of eligibility or malicious tampering.',
    },
    {
      id: 2,
      title: 'How do I redeem tickets?',
      content: 'Tickets are combined and redeemed automatically by your node to save on gas prices.',
    },
    {
      id: 3,
      title: 'Tickets values are different?',
      content: 'The table of the Incomming Channels shows the value of tickets counted from last reset of your node, and the Tickets subpage shows the ticket number from the last reset of the node databse.',
    },
    // {
    //   id: 3,
    //   title: 'When should I redeem my tickets?',
    //   content:
    //     'Ticket redemption costs a small fee in xDAI to complete the on-chain transaction. To lower this cost, the HOPR protocol batches ticket redemption, so it is generally more efficient to redeem multiple tickets at once. For maximum margins, only redeem tickets when you would otherwise lose them due to channel closure.',
    // },
    {
      id: 4,
      title: 'How is ticket value calculated?',
      content: 'Ticket value is the total wxHOPR earned from all your winning tickets redeemed.',
    },
    {
      id: 5,
      title: 'Why are there losing tickets?',
      content:
        'By issuing empty (losing) tickets and higher-value winning tickets at a lower probability, it reduces the amount of tickets you need to redeem on-chain for a similar amount of earned tokens over time. This increases the margin for node runners by reducing on-chain costs.',
    },
    {
      id: 6,
      title: 'How do I redeem neglected tickets?',
      content:
        'Currently, there is no way to redeem neglected tickets. Make sure to redeem tickets before closing channels.',
    },
    {
      id: 7,
      title: 'Unredeemed tickets',
      content:
        'The tickets earned by your node that have yet to be redeemed. Those tickets have to reach a specified treshold per channel in order to automaticly get redeemd. Please check the incomming channels page to see the number of unredeemed tickets per channel.',
    },
  ],
  '/node/metrics': [
    {
      id: 1,
      title: 'What is a PRN?',
      content:
        'A Public Relay Node (PRN) is an intermediary node used by other nodes on the network to communicate. As most nodes are behind NAT, it is difficult at times to send information directly to the IP address of the node.',
    },
    {
      id: 2,
      title: 'Why are my connection attempts failing?',
      content: (
        <span>
          If a large proportion of your connection attempts are failing, there is likely an issue with your node or a
          bug. This is diagnostic information you can pass on for support to one of our ambassadors on Telegram:{' '}
          <a
            href="https://t.me/hoprnet"
            target="_blank"
            rel="noreferrer"
          >
            https://t.me/hoprnet
          </a>
        </span>
      ),
    },
    {
      id: 3,
      title: 'What is STUN?',
      content:
        'Stun is a protocol which helps in dealing with nodes behind Network Address Translation (NAT), which is most nodes on the network.',
    },
    {
      id: 4,
      title: 'What is TCP/UDP?',
      content:
        'These are two transport protocols for sending data across networks. We mainly use TCP, although at times, it is better to use UDP for certain NAT nodes.',
    },
    {
      id: 5,
      title: 'What is an exposed host?',
      content:
        'You can expose your node through port forwarding or other methods, which make your node easier to access. This allows it to be accessed directly without the need for a PRN.',
    },
    {
      id: 6,
      title: 'What are node strategies?',
      content:
        'Node strategies are automatic node management settings you can apply to your node. This means you will not have to manually open/close channels or allocate funds, but your node will automatically do this to keep your node well-connected.',
    },
    {
      id: 7,
      title: 'What is a tick?',
      content:
        'If you have set an active node strategy, every so often your node will check the topology of the network and the health of your connections and use this information to make decisions which are in line with your strategy. For example, closing underfunded channels or channels to a node you have a low-quality connection to. The last time your node did this is the last "tick".',
    },
    {
      id: 8,
      title: 'What are channels, and why do I need them?',
      content:
        'Payment channels are funded connections between two nodes. Without a payment channel open to node X, you cannot use node X to relay data. You want to have a set of well-funded and well-connected channels to and from your node, so it is used for more relays.',
    },
    {
      id: 9,
      title: 'What is a v8 engine?',
      content:
        'This is the core technology that translates your JS source code into machine instructions your node can process.',
    },
    {
      id: 10,
      title: 'What is a heap?',
      content: 'A heap is a specific way to allocate a set of data so that it is easy to sort and prioritize.',
    },
  ],
  '/node/ping': [
    {
      id: 1,
      title: 'Why should I ping someone?',
      content:
        'A ping is a great way to see if a node is active and available. Send a ping to see if the node you want to communicate with or open a channel to is actually responsive or not.',
    },
  ],
  '/networking/peers': [
    {
      id: 1,
      title: 'Why would a node not be eligible?',
      content:
        'An ineligible node has not been given access to the network and thus cannot properly communicate with other nodes on the network. These are nodes that have not yet been approved through the waitlist.',
    },
    {
      id: 2,
      title: 'Does the number of peers impact my node performance?',
      content:
        'Generally having more visible nodes is better. If nodes on the network are not visible to you, this could be a sign of lower performance or node health. But as long as this number is not zero or very low, you are likely fine.',
    },
    {
      id: 3,
      title: 'What is a multiaddrs?',
      content:
        'It is a format to put all the different protocols used to communicate with a node into a single address. For example, TCP/IP/UDP/HTTP etc...',
    },
  ],
  '/networking/aliases': [
    {
      id: 1,
      title: 'What is an alias?',
      content:
        'An alias is a nickname you set a node so you can keep a reminder of who they are. E.g. Great Node 3, John etc...',
    },
  ],
  '/networking/channels-INCOMING': [
    {
      id: 1,
      title: 'Unredeemed tickets',
      content:
        'The tickets earned by your node that have yet to be redeemed. Those tickets have to reach a specified treshold per channel in order to automaticly get redeemd. Please check the incomming channels page to see the number of unredeemed tickets per channel',
    },
    {
      id: 2,
      title: 'Tickets values are different?',
      content: 'The table of the Incomming Channels shows the value of tickets counted from last reset of your node, and the Tickets subpage shows the ticket number from the last reset of the node databse.',
    },
  ],
  '/networking/channels': [
    {
      id: 1,
      title: 'How much wxHOPR should be in channels?',
      content:
        'A channel with less than 0.05 wxHOPR would be considered underfunded and soon to run out of wxHOPR. If it is actively used this will drain very quickly.',
    },
    {
      id: 2,
      title: 'Different channel statuses',
      content: (
        <span>
          You can view the lifecycle of a payment channel and what the different states mean here:{' '}
          <a
            href="https://docs.hoprnet.org/developers/smart-contract#lifecycle-of-payment-channel"
            target="_blank"
            rel="noreferrer"
          >
            https://docs.hoprnet.org/developers/smart-contract#lifecycle-of-payment-channel
          </a>
        </span>
      ),
    },
  ],
};

export default nodeFaq;
