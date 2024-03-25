import { useEffect } from 'react';
import { StepContainer, ConfirmButton } from '../components';
import { useNavigate } from 'react-router-dom';
//@ts-ignore
import confetti from 'canvas-confetti';

export default function NodeIsReady() {
  const navigate = useNavigate();

  useEffect(() => {
    const interval1 = setInterval(doConfetti, 500);
    setTimeout(() => {
      clearInterval(interval1);
    }, 4_000);
    return () => {
      clearInterval(interval1);
    };
  }, []);

  const doConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.5 },
    };

    function fire(particleRatio: number, opts: object) {
      confetti(
        Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio),
        })
      );
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  doConfetti();

  return (
    <StepContainer
      title="CONGRATULATIONS YOUR NODE HAS BEEN ADDED!"
      description={'Your node and safe are now completely set up and ready to use!'}
      image={{
        src: '/assets/HOPR_Node_Happy.svg',
        alt: 'Onboarding done',
        height: 300,
      }}
      buttons={
        <ConfirmButton
          onClick={() => {
            navigate('/staking/dashboard');
          }}
          style={{ maxWidth: '300px' }}
        >
          VIEW STAKING OVERVIEW
        </ConfirmButton>
      }
    ></StepContainer>
  );
}
