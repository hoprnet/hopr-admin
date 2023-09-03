import { StepContainer, ConfirmButton } from '../components';

//Store
import { useAppDispatch } from '../../../../store';
import { stakingHubActions } from '../../../../store/slices/stakingHub';


export default function safeIsReady() {
  const dispatch = useAppDispatch();
  return (
    <StepContainer
      description={'Funds successfully transferred to Safe. Now let's set up your HOPR node!'}
      image={{
        src: '/assets/safe-success-2.svg',
        alt: 'Safe deployed successfully',
        height: 300,
      }}
      buttons={
        <ConfirmButton
          onClick={() => {
            dispatch(stakingHubActions.setOnboardingStep(6));
          }}
        >
          CONTINUE
        </ConfirmButton>
      }
    />
  );
}
