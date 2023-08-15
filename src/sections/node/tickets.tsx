import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { actionsAsync } from '../../store/slices/node/actionsAsync';
import { exportToFile } from '../../utils/helpers';

// HOPR Components
import { TableExtended } from '../../future-hopr-lib-components/Table/columed-data';
import { SubpageTitle } from '../../components/SubpageTitle';
import Section from '../../future-hopr-lib-components/Section';
import IconButton from '../../future-hopr-lib-components/Button/IconButton';
import GetAppIcon from '@mui/icons-material/GetApp';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

// Mui
import { Paper, Tooltip } from '@mui/material';

function TicketsPage() {
  const dispatch = useAppDispatch();
  const tickets = useAppSelector((store) => store.node.tickets.data);
  const ticketsFetching = useAppSelector((store) => store.node.tickets.isFetching);
  const statistics = useAppSelector((store) => store.node.statistics.data);
  const statisticsFetching = useAppSelector((store) => store.node.statistics.isFetching);
  const loginData = useAppSelector((store) => store.auth.loginData);
  const [redeemErrors, set_redeemErrors] = useState<{ status: string | undefined; error: string | undefined }[]>([]);
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
        handleRefresh();
      })
      .catch((e) => {
        set_redeeming(false);
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
      fullHeightMin
      yellow
    >
      <SubpageTitle
        title="TICKETS"
        refreshFunction={handleRefresh}
        reloading={ticketsFetching || statisticsFetching}
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
      <Paper
        style={{
          padding: '24px',
          width: 'calc( 100% - 48px )',
        }}
      >
        <TableExtended
          title="Ticket statistics"
          style={{ marginBottom: '32px' }}
        >
          <tbody>
            <tr>
              <Tooltip title="The number of tickets earned by another node in a channel connected to you which have yet to be redeemed. These must be redeemed by another node.">
                <th>Pending</th>
              </Tooltip>
              <td>{statistics?.pending}</td>
            </tr>
            <tr>
              <Tooltip title="The number of tickets earned by your node that have yet to be redeemed.">
                <th>Unredeemed</th>
              </Tooltip>
              <td>{statistics?.unredeemed}</td>
            </tr>
            <tr>
              <Tooltip title="The value of all your unredeemed tickets in HOPR tokens.">
                <th>Unredeemed value</th>
              </Tooltip>
              <td>{statistics?.unredeemedValue}</td>
            </tr>
            <tr>
              <Tooltip title="The number of tickets redeemed by your node.">
                <th>Redeemed</th>
              </Tooltip>
              <td>{statistics?.redeemed}</td>
            </tr>
            <tr>
              <Tooltip title="The value of all your redeemed tickets.">
                <th>Redeemed value</th>
              </Tooltip>
              <td>{statistics?.redeemedValue}</td>
            </tr>
            <tr>
              <Tooltip title="The number of tickets which were empty (do not contain HOPR).">
                <th>Losing tickets</th>
              </Tooltip>
              <td>{statistics?.losingTickets}</td>
            </tr>
            <tr>
              <Tooltip title="The percentage of tickets earned by your node that were winning.">
                <th>Win proportion</th>
              </Tooltip>
              <td>{statistics?.winProportion}</td>
            </tr>
            <tr>
              <Tooltip title="The number of tickets lost due to channels closing without ticket redemption.">
                <th>Neglected</th>
              </Tooltip>
              <td>{statistics?.neglected}</td>
            </tr>
            <tr>
              <Tooltip title="The number of tickets which were rejected by the network due to suspicious activity or lack of eligibility.">
                <th>Rejected</th>
              </Tooltip>
              <td>{statistics?.rejected}</td>
            </tr>
            <tr>
              <Tooltip title="The value of your rejected tickets in HOPR tokens.">
                <th>Rejected value</th>
              </Tooltip>
              <td>{statistics?.rejectedValue}</td>
            </tr>
          </tbody>
        </TableExtended>
      </Paper>
    </Section>
  );
}

export default TicketsPage;
