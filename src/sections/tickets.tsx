import Section from '../future-hopr-lib-components/Section';
import { useAppDispatch, useAppSelector } from '../store';
import { useEffect, useRef, useState } from 'react';
import { actionsAsync } from '../store/slices/node/actionsAsync';
import { utils } from '@hoprnet/hopr-sdk';
const { APIError } = utils;

function TicketsPage() {
  const dispatch = useAppDispatch();
  const tickets = useAppSelector((selector) => selector.sdk.tickets);
  const statistics = useAppSelector((selector) => selector.sdk.statistics);
  const loginData = useAppSelector((selector) => selector.auth.loginData);
  const [redeemSuccess, set_redeemSuccess] = useState(false);
  const [redeemErrors, set_redeemErrors] = useState<
    { status: string | undefined; error: string | undefined }[]
  >([]);

  useEffect(() => {
    if (loginData.apiEndpoint && loginData.apiToken) {
      dispatch(
        actionsAsync.getStatisticsThunk({
          apiEndpoint: loginData.apiEndpoint,
          apiToken: loginData.apiToken,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginData]);

  return (
    <Section className="Section--tickets" id="Section--tickets" yellow>
      <h2>
        Tickets{' '}
        <button
          onClick={() => {
            if (loginData.apiEndpoint && loginData.apiToken) {
              dispatch(
                actionsAsync.getStatisticsThunk({
                  apiEndpoint: loginData.apiEndpoint,
                  apiToken: loginData.apiToken,
                })
              );
            }
          }}
        >
          Refresh
        </button>
      </h2>
      <div>Unredeemed: {statistics?.unredeemed}</div>
      <div>Redeemed: {statistics?.redeemed}</div>
      <RedeemTickets
        onSuccess={() => {
          set_redeemSuccess(true);
        }}
        onError={(e) => {
          set_redeemSuccess(false);
          set_redeemErrors([
            ...redeemErrors,
            {
              error: e.error,
              status: e.status,
            },
          ]);
        }}
      />
    </Section>
  );
}

function RedeemTickets({
  onError,
  onSuccess,
}: {
  onError: (e: typeof APIError.prototype) => void;
  onSuccess: () => void;
}) {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector((selector) => selector.auth.loginData);

  return (
    <button
      onClick={() => {
        if (loginData.apiEndpoint && loginData.apiToken) {
          dispatch(
            actionsAsync.redeemTicketsThunk({
              apiEndpoint: loginData.apiEndpoint,
              apiToken: loginData.apiToken,
            })
          )
            .unwrap()
            .then(() => {
              onSuccess();
            })
            .catch((e) => onError(e));
        }
      }}
    >
      Redeem All
    </button>
  );
}

export default TicketsPage;
