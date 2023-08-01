import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { actionsAsync } from '../store/slices/node/actionsAsync';
import { exportToFile } from '../utils/helpers';

// HOPR Components
import { TableExtended } from '../future-hopr-lib-components/Table/columed-data';
import { SubpageTitle } from '../components/SubpageTitle';
import Section from '../future-hopr-lib-components/Section';
import IconButton from '../future-hopr-lib-components/Button/IconButton';
import GetAppIcon from '@mui/icons-material/GetApp';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

//Mui
import CircularProgress from '@mui/material/CircularProgress';

function TicketsPage() {
  const dispatch = useAppDispatch();
  const tickets = useAppSelector((selector) => selector.node.tickets);
  const statistics = useAppSelector((selector) => selector.node.statistics);
  const loginData = useAppSelector((selector) => selector.auth.loginData);
  const [redeemSuccess, set_redeemSuccess] = useState(false);
  const [redeemErrors, set_redeemErrors] = useState<{ status: string | undefined; error: string | undefined }[]>([]);
  const [showStatistics, set_showStatistics] = useState(false);
  const [showTickets, set_showTickets] = useState(false);
  const [redeeming, set_redeeming] = useState(false);

  useEffect(() => {
    handleRefresh();
  }, [loginData, dispatch]);

  const handleRefresh = () => {
    dispatch(
      actionsAsync.getStatisticsThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
      }),
    );
    dispatch(
      actionsAsync.getTicketsThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
      }),
    );
  };

  const handleRedeemAllTickets = () => {
    set_redeeming(true);
    dispatch(
      actionsAsync.redeemTicketsThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
      }),
    )
      .unwrap()
      .then(() => {
        set_redeeming(false);
        set_redeemSuccess(true);
        handleRefresh();
      })
      .catch((e) => {
        set_redeeming(false);
        set_redeemSuccess(false);
        set_redeemErrors([
          ...redeemErrors,
          {
            error: e.error,
            status: e.status,
          },
        ]);
      });
  };

  return (
    <Section
      className="Section--tickets"
      id="Section--tickets"
      yellow
      fullHeightMin
    >
      <SubpageTitle
        title="Tickets"
        refreshFunction={handleRefresh}
        actions={
          <>
            <IconButton
              iconComponent={<ExitToAppIcon />}
              tooltipText="Redeem all tickets"
              reloading={redeeming}
              onClick={handleRedeemAllTickets}
            />
            <IconButton
              iconComponent={<GetAppIcon />}
              tooltipText="Download all tickets as JSON"
              onClick={() => {
                exportToFile(JSON.stringify(tickets), 'tickets.json', 'text/json');
              }}
            />
          </>
        }
      />
      <TableExtended
        title="Ticket statistics"
        style={{ marginBottom: '32px' }}
      >
        <tbody>
          <tr>
            <th>Pending count</th>
            <td>{statistics.data?.pending}</td>
          </tr>
          <tr>
            <th>Unredeemed count</th>
            <td>{statistics.data?.unredeemed}</td>
          </tr>
          <tr>
            <th>Unredeemed value</th>
            <td>{statistics.data?.unredeemedValue}</td>
          </tr>
          <tr>
            <th>Redeemed count</th>
            <td>{statistics.data?.redeemed}</td>
          </tr>
          <tr>
            <th>Redeemed value</th>
            <td>{statistics.data?.redeemedValue}</td>
          </tr>
          <tr>
            <th>Losing tickets count</th>
            <td>{statistics.data?.losingTickets}</td>
          </tr>
          <tr>
            <th>Win proportion</th>
            <td>{statistics.data?.winProportion}</td>
          </tr>
          <tr>
            <th>Neglected count</th>
            <td>{statistics.data?.neglected}</td>
          </tr>
          <tr>
            <th>Rejected count</th>
            <td>{statistics.data?.rejected}</td>
          </tr>
          <tr>
            <th>Rejected value</th>
            <td>{statistics.data?.rejectedValue}</td>
          </tr>
        </tbody>
      </TableExtended>
    </Section>
  );
}

export default TicketsPage;
