type FaqElement = {
  id: number;
  title: string;
  content: string | JSX.Element;
};

type FaqData = Record<string, FaqElement[]>;

const stakingFaq: FaqData = {
  '/staking/onboarding#0': [
    {
      id: 1,
      title: 'Token addresses',
      content: (
        <span>
          HOPR (Ethereum): 0xf5581dfefd8fb0e4aec526be659cfab1f8c781da
          <br />
          xHOPR (Gnosis chain): 0xD057604A14982FE8D88c5fC25Aac3267eA142a08
          <br />
          wxHOPR (Gnosis chain): 0xD4fdec44DB9D44B8f2b6d529620f9C0C7066A2c1
        </span>
      ),
    },
    {
      id: 2,
      title: 'Buying xDAI & HOPR',
      content: (
        <span>
          You can find the best options for buying HOPR, DAI, xDAI and xHOPR in our{' '}
          <a
            href="https://docs.hoprnet.org/staking/how-to-get-hopr"
            target="_blank"
            rel="noreferrer"
          >
            docs
          </a>
          .
        </span>
      ),
    },
    {
      id: 3,
      title: 'Why do I need wxHOPR?',
      content:
        'wxHOPR is used to fund channels with other nodes on the network. Well-connected nodes are able to relay more data and earn a higher yield.',
    },
    {
      id: 4,
      title: 'Wrapping xHOPR → wxHOPR',
      content: (
        <span>
          You can convert your xHOPR to wxHOPR by using our wrapper on the{' '}
          <a
            href="https://wrapper.hoprnet.org/"
            target="_blank"
            rel="noreferrer"
          >
            staking hub
          </a>
          .
        </span>
      ),
    },
    {
      id: 5,
      title: 'How do I get an Network Registry NFT?',
      content:
        'Network Registry NFTs were given to node runners of previous HOPR releases. We no longer distribute this NFT. So unless you have already been airdropped one by HOPR, you will only be able to find them on NFT marketplaces.',
    },
  ],
  '/staking/onboarding#1': [
    {
      id: 1,
      title: 'Managing owners',
      content: 'You can change ownership after safe creation.',
    },
  ],
  '/staking/onboarding#3': [
    {
      id: 1,
      title: 'How do I get an Network Registry NFT?',
      content:
        'Network Registry NFTs were given to node runners of previous HOPR releases. We no longer distribute this NFT. So unless you have already been airdropped one by HOPR, you will only be able to find them on NFT marketplaces.',
    },
    {
      id: 2,
      title: 'What happens if I have multiple Network Registry NFTS?',
      content:
        'If you have more than one Network Registry NFT, only the one with the lowest ID number will be transferred to your safe, and the rest will remain in your wallet.',
    },
  ],
  '/staking/onboarding#4': [
    {
      id: 1,
      title: 'Token addresses',
      content: (
        <span>
          HOPR (Ethereum): 0xf5581dfefd8fb0e4aec526be659cfab1f8c781da
          <br />
          xHOPR (Gnosis chain): 0xD057604A14982FE8D88c5fC25Aac3267eA142a08
          <br />
          wxHOPR (Gnosis chain): 0xD4fdec44DB9D44B8f2b6d529620f9C0C7066A2c1
        </span>
      ),
    },
    {
      id: 2,
      title: 'Why do I need wxHOPR?',
      content:
        'wxHOPR is used to fund channels with other nodes on the network. Well-connected nodes are able to relay more data and earn a higher yield.',
    },
    {
      id: 3,
      title: 'Buying xDAI & HOPR',
      content: (
        <span>
          You can find the best options for buying HOPR, DAI, xDAI and xHOPR in our{' '}
          <a
            href="https://docs.hoprnet.org/staking/how-to-get-hopr"
            target="_blank"
            rel="noreferrer"
          >
            docs
          </a>
          .
        </span>
      ),
    },
    {
      id: 4,
      title: 'Wrapping xHOPR → wxHOPR',
      content: (
        <span>
          You can convert your xHOPR to wxHOPR by using our wrapper on the{' '}
          <a
            href="https://wrapper.hoprnet.org/"
            target="_blank"
            rel="noreferrer"
          >
            staking hub
          </a>
          .
        </span>
      ),
    },
    {
      id: 5,
      title: 'How much xDAI should I transfer?',
      content:
        'One xDAI is sufficient to start running a node without any concerns. A lower amount may lead to insufficient funds for on-chain transactions.',
    },
  ],
  '/staking/onboarding#7': [
    {
      id: 1,
      title: 'Setup Docker',
      content: (
        <span>
          You will need to install Docker on your device to complete this installation. Follow{' '}
          <a
            href="https://docs.hoprnet.org/node/using-docker#1-install-docker"
            target="_blank"
            rel="noreferrer"
          >
            these instructions
          </a>{' '}
          if you don't have Docker installed.
        </span>
      ),
    },
    {
      id: 2,
      title: 'Install Node',
      content: (
        <span>
          You can view a complete breakdown of how to install a HOPR node using Docker{' '}
          <a
            href="https://docs.hoprnet.org/node/using-docker"
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
      id: 3,
      title: 'Adding your IP address',
      content: (
        <span>
          You will need to edit the Docker command to include your public IP address. To find your IP address and edit
          the command correctly follow the instructions{' '}
          <a
            href="https://docs.hoprnet.org/node/hidden-page#find-your-ip-address"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
        </span>
      ),
    },
  ],
  '/staking/onboarding#10': [
    {
      id: 1,
      title: 'How long do I have to wait to be approved?',
      content:
        'We will be onboarding node runners at approximately 10 a week, you may have to wait several weeks to be added to the network.',
    },
    {
      id: 2,
      title: 'Can I withdraw my funds and still stay on the waitlist?',
      content:
        "No, you can't. The stake of safe addresses is checked upon review. A safe address without a sufficient stake will be removed from the list. Rejoining the waitlist will put you at the back of the queue as we operate on a first come first serve basis.",
    },
    {
      id: 3,
      title: 'What happens to my funds',
      content:
        'They remain in your HOPR safe. You can withdraw them at any time, but this will remove you from the waitlist.',
    },
    {
      id: 4,
      title: 'What do I do once my safe address is approved?',
      content: 'Come back to this page, and you will automatically be redirected to continue your onboarding.',
    },
    {
      id: 5,
      title: 'How much xDAI should I transfer?',
      content:
        'One xDAI is sufficient to start running a node without any concerns. A lower amount may lead to insufficient funds for on-chain transactions.',
    },
  ],
  '/staking/onboarding#14': [
    {
      id: 1,
      title: 'How much xDAI should I transfer?',
      content:
        'One xDAI is sufficient to start your node without any concerns. A lower amount may lead to insufficient funds for on-chain transactions.',
    },
  ],
  '/staking/onboarding#15': [
    {
      id: 1,
      title: 'What is node allowance?',
      content:
        'This is the maximum amount of wxHOPR your node is allowed to request from your safe. Your node needs access to wxHOPR to open and fund payment channels and relay data, but unchecked access can leave your funds in danger.',
    },
    {
      id: 2,
      title: 'What should I set my allowance to?',
      content:
        'Setting it too high may result in a drainage of funds if your node is ever compromised, but a sufficient amount is needed in order to create a well connected node that can maximize its APY. You are free to choose your own risk profile but we recommend using the default value as it is more than sufficient to fund a well connected node.',
    },
  ],
  '/steps/update-your-node': [
    {
      id: 1,
      title: 'How to update my node',
      content: (
        <span>
          The process for updating your node depends on the device you're using. Follow the appropriate link for your
          setup.
          <br />
          <br />- For Dappnode users, click <a href="#">here</a> for the steps.
          <br />- Docker users, find your instructions{' '}
          <a
            href="https://docs.hoprnet.org/node/using-docker#updating-to-a-new-release"
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
      id: 2,
      title: 'How to restart my node',
      content: (
        <span>
          The process for restarting your node depends on the device you're using. Follow the appropriate link for your
          setup.
          <br />
          <br />- For Dappnode users, click <a href="#">here</a> for the steps.
          <br />- Docker users, find your instructions <a href="#">here</a>.
        </span>
      ),
    },
    {
      id: 3,
      title: 'How much xDAI should I transfer?',
      content:
        'One xDAI is sufficient to start running a node without any concerns. A lower amount may lead to insufficient funds for on-chain transactions.',
    },
  ],
  'send wxHopr to safe (stake in figma)': [
    {
      id: 1,
      title: 'Token addresses',
      content: (
        <span>
          HOPR (Ethereum): 0xf5581dfefd8fb0e4aec526be659cfab1f8c781da
          <br />
          xHOPR (Gnosis chain): 0xD057604A14982FE8D88c5fC25Aac3267eA142a08
          <br />
          wxHOPR (Gnosis chain): 0xD4fdec44DB9D44B8f2b6d529620f9C0C7066A2c1
        </span>
      ),
    },
    {
      id: 2,
      title: 'Wrapping xHOPR → wxHOPR',
      content: (
        <span>
          You can convert your xHOPR to wxHOPR by using our wrapper on the{' '}
          <a
            href="https://wrapper.hoprnet.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            staking hub
          </a>
          .
        </span>
      ),
    },
  ],
  'additional xdai to safe': [
    {
      id: 1,
      title: 'Buying xDAI & HOPR',
      content: (
        <span>
          You can find the best options for buying HOPR, DAI, xDAI and xHOPR in our{' '}
          <a
            href="https://docs.hoprnet.org/staking/how-to-get-hopr"
            target="_blank"
            rel="noreferrer"
          >
            docs
          </a>
          .
        </span>
      ),
    },
    {
      id: 2,
      title: 'How much xDAI should I transfer?',
      content:
        'One xDAI is sufficient to start running a node without any concerns. A lower amount may lead to insufficient funds for on-chain transactions.',
    },
  ],
  '/staking/wrapper': [
    {
      id: 1,
      title: 'Where can I buy xHOPR?',
      content: (
        <span>
          You can find the best options for buying HOPR, DAI, xDAI and xHOPR in{' '}
          <a
            href="https://docs.hoprnet.org/staking/how-to-get-hopr"
            target="_blank"
            rel="noreferrer"
          >
            our docs
          </a>
          .
        </span>
      ),
    },
    {
      id: 2,
      title: 'What is wrapping?',
      content:
        'Wrapping a token allows it to be used on a non-native blockchain. Similar to switching a dollar for four quarters so you can use the machine that only takes quarters. You need to wxHOPR to fund payment channels in the HOPR network, but you can always swap the wxHOPR back for an equal amount of xHOPR ot HOPR.',
    },
  ],
  '/staking/dashboard#staking': [
    {
      id: 1,
      title: 'How much xDAI should I deposit',
      content:
        'One xDAI is sufficient to start running a node without any concerns. A lower amount may lead to insufficient funds for on-chain transactions.',
    },
    {
      id: 2,
      title: 'Where can I buy xDAI',
      content: (
        <span>
          You can find the best options for buying HOPR, DAI, xDAI and xHOPR in our{' '}
          <a
            href="https://docs.hoprnet.org/staking/how-to-get-hopr"
            target="_blank"
            rel="noreferrer"
          >
            docs
          </a>
          .
        </span>
      ),
    },
    {
      id: 3,
      title: 'What is my expected APY',
      content: (
        <span>
          This will vary depending on how many nodes are in the network, how much wxHOPR you have staked and how many
          nodes you are running. You can view a complete breakdown of the economic model{' '}
          <a
            href="https://twitter.com/hoprnet/status/1696539901305790534"
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
      title: 'Withdrawing my wxHOPR',
      content: (
        <span>
          There is no lock-up period for funds deposited in the HOPR safe. You can withdraw them at any time.
          <br />
          <br />
          Although be warned, dropping below the minimum holding of 30,000 wxHOPR may lead to your node being removed
          from the network
        </span>
      ),
    },
  ],
  '/staking/dashboard#node': [
    {
      id: 1,
      title: 'How much xDAI should I deposit?',
      content:
        'Your node can be funded and run successfully with 1 xDAI. Depositing more in your safe will make refunding your node easier but in general, node running with HOPR does not require much xDAI.',
    },
    {
      id: 2,
      title: 'Suggested node strategy',
      content: 'Not defined TBD',
    },
    {
      id: 3,
      title: 'Waitlist status and policy',
      content: (
        <span>
          After creating and funding your safe, you will need to register your safe address on to the waitlist using
          this{' '}
          <a
            href="https://cryptpad.fr/form/#/2/form/view/K3KSF-UAM-mLjUCs4w3Cruu4wZeOdwQFLNG1aYqrjbg/"
            target="_blank"
            rel="noreferrer"
          >
            form
          </a>
          .<br />
          <br />
          Nodes are onboarded into the HOPR network in a first come, first serve basis. So fill out the form as soon as
          possible if you haven't already.
        </span>
      ),
    },
    {
      id: 4,
      title: 'Managing wxHOPR allowance',
      content: (
        <span>
          Make sure your allowance aligns with your node strategy and is not draining your tokens or preventing you from
          producing well-connected nodes. You can always change your node allowance <a href="#node">here</a>.{' '}
          {/*FIXME: put link to specific page */}
        </span>
      ),
    },
    {
      id: 5,
      title: 'Remove node from safe',
      content: (
        <span>
          To remove your node from your safe, first, execute the removeNode(address nodeAddress) function on the{' '}
          <a
            href="https://gnosisscan.io/address/0xB7397C218766eBe6A1A634df523A1a7e412e67eA#writeContract"
            target="_blank"
            rel="noreferrer"
          >
            NodeManagementModule contract
          </a>
          .<br />
          <br />
          Then remove the node as a delegate from the safe. You can view how to do this two-step procedure in our docs{' '}
          <a
            href="https://docs.hoprnet.org/node/using-hopr-admin#remove-your-node"
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
      id: 6,
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
      id: 7,
      title: 'What is a delegate',
      content: (
        <span>
          When a node is a delegate, it is be able to submit transations to the safe, which later have to be signed by the safe owner/s.
          <br/><br/>
          If the safe owner will not sign a transaction, nothing will be done on-chain.
        </span>
      ),
    },
  ],
};

export default stakingFaq;
