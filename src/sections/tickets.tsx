import Section from '../future-hopr-lib-components/Section';
import { useAppDispatch, useAppSelector } from '../store';
import { useEffect, useState } from 'react';
import { actionsAsync } from '../store/slices/node/actionsAsync';
import CircularProgress from '@mui/material/CircularProgress';
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
  const [showStatistics, set_showStatistics] = useState(false);
  const [showTickets, set_showTickets] = useState(false);

  useEffect(() => {
    dispatch(
      actionsAsync.getStatisticsThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
      })
    );
    dispatch(
      actionsAsync.getTicketsThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
      })
    );
  }, [loginData, dispatch]);

  const handleRefresh = () => {
    dispatch(
      actionsAsync.getStatisticsThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
      })
    );
    dispatch(
      actionsAsync.getTicketsThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
      })
    );
  };

  return (
    <Section className="Section--tickets" id="Section--tickets" yellow>
      <h2>
        Tickets{' '}
        <button
          onClick={() => {
            handleRefresh();
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
          handleRefresh();
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
      <div>
        <button
          onClick={() => {
            set_showStatistics(!showStatistics);
          }}
        >
          {showStatistics ? 'Hide Statistics' : 'Show Statistics'}
        </button>
        {showStatistics && (
          <pre>
            {statistics
              ? JSON.stringify(statistics, null, 2)
              : 'No statistics available'}
          </pre>
        )}
      </div>
      <div>
        <button
          onClick={() => {
            set_showTickets(!showTickets);
          }}
        >
          {showTickets ? 'Hide Tickets' : 'Show Tickets'}
        </button>
        {showTickets && (
          <pre>
            {tickets
              ? JSON.stringify(tickets, null, 4)
              : 'No tickets available'}
          </pre>
        )}
      </div>
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
  const [redeeming, set_redeeming] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          set_redeeming(true);
          dispatch(
            actionsAsync.redeemTicketsThunk({
              apiEndpoint: loginData.apiEndpoint!,
              apiToken: loginData.apiToken!,
            })
          )
            .unwrap()
            .then(() => {
              set_redeeming(false);
              onSuccess();
            })
            .catch((e) => {
              set_redeeming(false);
              onError(e);
            });
        }}
      >
        Redeem All
      </button>
      {redeeming && <CircularProgress />}
    </>
  );
}

export default TicketsPage;
