type FaqElement = {
  id: number;
  title: string;
  content: string | JSX.Element;
};

type FaqData = Record<string, FaqElement[]>;

const stakingAlerts: FaqData = { '/staking/onboarding#15': [
  {
    id: 1,
    title: 'Funds at risk',
    content:
        'If your node is ever compromised it may lead to your entire allowance of wxHOPR being drained. Please set a reasonable allowance, and use our default value as a guideline.',
  },
] };

export default stakingAlerts;
