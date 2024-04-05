import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { actionsAsync } from '../../store/slices/node/actionsAsync';
import { exportToFile } from '../../utils/helpers';
import { formatEther } from 'viem';

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
  const statistics = useAppSelector((store) => store.node.statistics.data);
  const statisticsFetching = useAppSelector((store) => store.node.statistics.isFetching);
  const redeemTicketsFetching = useAppSelector((store) => store.node.redeemTickets.isFetching);
  const redeemTicketsErrors = useAppSelector((store) => store.node.redeemTickets.error);
  const loginData = useAppSelector((store) => store.auth.loginData);

  useEffect(() => {
    handleRefresh();
  }, [loginData, dispatch]);

  const handleRefresh = () => {
    if(loginData.apiEndpoint && loginData.apiToken) {
      dispatch(
        actionsAsync.getTicketStatisticsThunk({
          apiEndpoint: loginData.apiEndpoint,
          apiToken: loginData.apiToken,
        })
      );
    }
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
        reloading={statisticsFetching}
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
                  title="The value of all your unredeemed tickets in HOPR tokens."
                  notWide
                >
                  <span>Unredeemed value</span>
                </Tooltip>
              </th>
              <td>{statistics?.unredeemedValue ? formatEther(BigInt(statistics?.unredeemedValue as string)) : '-'} wxHOPR</td>
            </tr>
            <tr>
              <th>
                <Tooltip
                  title="The number of tickets lost due to channels closing without ticket redemption."
                  notWide
                >
                  <span>Neglected value</span>
                </Tooltip>
              </th>
              <td>{statistics?.neglectedValue ? formatEther(BigInt(statistics?.neglectedValue as string)) : '-'} wxHOPR</td>
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
              <td>{statistics?.rejectedValue ? formatEther(BigInt(statistics?.rejectedValue as string)) : '-'} wxHOPR</td>
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
              <td>{statistics?.redeemedValue ? formatEther(BigInt(statistics?.redeemedValue as string)) : '-'} wxHOPR</td>
            </tr>
          </tbody>
        </TableExtended>
      </Paper>
    </Section>
  );
}

export default TicketsPage;
