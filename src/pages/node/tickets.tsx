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
import Tooltip from '../../future-hopr-lib-components/Tooltip/tooltip-fixed-width';

// Mui
import { Paper } from '@mui/material';

function TicketsPage() {
  const dispatch = useAppDispatch();
  const tickets = useAppSelector((store) => store.node.tickets.data);
  const ticketsFetching = useAppSelector((store) => store.node.tickets.isFetching);
  const statistics = useAppSelector((store) => store.node.statistics.data);
  const statisticsFetching = useAppSelector((store) => store.node.statistics.isFetching);
  const redeemTicketsFetching = useAppSelector((store) => store.node.redeemTickets.isFetching);
  const redeemTicketsErrors = useAppSelector((store) => store.node.redeemTickets.error);
  const loginData = useAppSelector((store) => store.auth.loginData);

  useEffect(() => {
    handleRefresh();
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

  const handleRedeemAllTickets = () => {
    dispatch(
      actionsAsync.redeemTicketsThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
      })
    )
      .unwrap()
      .then(() => {
        handleRefresh();
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
            {/* <IconButton
              iconComponent={<ExitToAppIcon />}
              tooltipText={
                <span>
                  REDEEM
                  <br />
                  all tickets
                </span>
              }
              reloading={redeemTicketsFetching}
              onClick={handleRedeemAllTickets}
            /> */}
            <IconButton
              iconComponent={<GetAppIcon />}
              tooltipText={
                <span>
                  EXPORT
                  <br />
                  all tickets as JSON
                </span>
              }
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
              <th>
                <Tooltip
                  title="The number of tickets earned by your node that have yet to be redeemed."
                  notWide
                >
                  <span>Unredeemed</span>
                </Tooltip>
              </th>
              <td>{statistics?.unredeemed}</td>
            </tr>
            <tr>
              <th>
                <Tooltip
                  title="The value of all your unredeemed tickets in HOPR tokens."
                  notWide
                >
                  <span>Unredeemed value</span>
                </Tooltip>
              </th>
              <td>{statistics?.unredeemedValue}</td>
            </tr>
            <tr>
              <th>
                <Tooltip
                  title="The number of tickets redeemed by your node."
                  notWide
                >
                  <span>Redeemed</span>
                </Tooltip>
              </th>
              <td>{statistics?.redeemed}</td>
            </tr>
            <tr>
              <th>
                <Tooltip
                  title="The value of all your redeemed tickets."
                  notWide
                >
                  <span>Redeemed value</span>
                </Tooltip>
              </th>
              <td>{statistics?.redeemedValue}</td>
            </tr>
            <tr>
              <th>
                <Tooltip
                  title="The number of tickets which were empty (do not contain HOPR)."
                  notWide
                >
                  <span>Losing tickets</span>
                </Tooltip>
              </th>
              <td>{statistics?.losingTickets}</td>
            </tr>
            <tr>
              <th>
                <Tooltip
                  title="The percentage of tickets earned by your node that were winning."
                  notWide
                >
                  <span>Win proportion</span>
                </Tooltip>
              </th>
              <td>{statistics?.winProportion}</td>
            </tr>
            <tr>
              <th>
                <Tooltip
                  title="The number of tickets lost due to channels closing without ticket redemption."
                  notWide
                >
                  <span>Neglected</span>
                </Tooltip>
              </th>
              <td>{statistics?.neglected}</td>
            </tr>
            <tr>
              <th>
                <Tooltip
                  title="The number of tickets which were rejected by the network due to suspicious activity or lack of eligibility."
                  notWide
                >
                  <span>Rejected</span>
                </Tooltip>
              </th>
              <td>{statistics?.rejected}</td>
            </tr>
            <tr>
              <th>
                <Tooltip
                  title="The value of your rejected tickets in HOPR tokens."
                  notWide
                >
                  <span>Rejected value</span>
                </Tooltip>
              </th>
              <td>{statistics?.rejectedValue}</td>
            </tr>
          </tbody>
        </TableExtended>
      </Paper>
    </Section>
  );
}

export default TicketsPage;
