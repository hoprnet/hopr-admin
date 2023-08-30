import { StepContainer, ConfirmButton } from '../components';

//Store
import { useAppDispatch } from '../../../../store';
import { stakingHubActions } from '../../../../store/slices/stakingHub';


export default function AddedToWhitelist() {
  const dispatch = useAppDispatch();
  return (
    <StepContainer
      title="Congratulations!"
      description={'You are now eligible to join the HOPR network! Continue below to set up your HOPR node.'}
      image={{
        src: '/assets/green-check.svg',
        alt: 'Safe deployed successfully',
        height: 200,
      }}
      buttons={
        <ConfirmButton
          onClick={() => {
            dispatch(stakingHubActions.setOnboardingStep(12));
          }}
        >
          Continue
        </ConfirmButton>
      }
    />
  );
}
