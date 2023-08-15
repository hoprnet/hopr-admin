import { useEffect } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from '../../store';
import { actionsAsync } from '../../store/slices/node/actionsAsync';
import Chart from 'react-apexcharts';
import { exportToFile } from '../../utils/helpers';

// HOPR components
import Section from '../../future-hopr-lib-components/Section';
import { TableExtended } from '../../future-hopr-lib-components/Table/columed-data';
import { SubpageTitle } from '../../components/SubpageTitle';
import IconButton from '../../future-hopr-lib-components/Button/IconButton';

// Mui
import GetAppIcon from '@mui/icons-material/GetApp';
import { Paper, Tooltip } from '@mui/material';

const TableTitle = styled.p`
  font-family: 'Source Code Pro';
  font-size: 14px;
  font-weight: 700;
  height: 18px;
  overflow-wrap: break-word;
  padding: 8px;
`;

function MetricsPage() {
  const metrics = useAppSelector((store) => store.node.metrics.data);
  const metricsFetching = useAppSelector((store) => store.node.metrics.isFetching);
  const loginData = useAppSelector((store) => store.auth.loginData);
  const {
    apiEndpoint,
    apiToken,
  } = loginData;

  const dispatch = useAppDispatch();

  useEffect(() => {
    handleRefresh();
  }, [apiEndpoint, apiToken]);

  const handleRefresh = () => {
    if (apiEndpoint && apiToken) {
      dispatch(
        actionsAsync.getPrometheusMetricsThunk({
          apiEndpoint,
          apiToken,
        }),
      );
    }
  };

  // We have to change names to the copy value
  function renderMetricsTable(parsedMetrics: any) {
    const render: any[] = [];
    for (const [key, value] of Object.entries(metrics.parsed)) {
      if (value.length === 1)
        render.push(
          <tr key={key}>
            <th>{value.name}</th>
            <td>{value.data[0]}</td>
          </tr>,
        );
    }
    return <tbody>{render}</tbody>;
  }

  return (
    <Section
      fullHeightMin
      yellow
    >
      <SubpageTitle
        title="METRICS"
        refreshFunction={handleRefresh}
        reloading={metricsFetching}
        actions={
          <>
            <IconButton
              iconComponent={<GetAppIcon />}
              tooltipText="Download metrics as a text file"
              onClick={() => {
                exportToFile(metrics.raw ? metrics.raw : 'error', 'metrics.txt', 'text/txt');
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
        <TableExtended width1stColumn={'400px'}>{renderMetricsTable(metrics?.parsed)}</TableExtended>
        <br />
        <br />
        <br />

        <Tooltip title="Displays the total time a single ping takes to complete (seconds).">
          <TableTitle>Total ping time</TableTitle>
        </Tooltip>
        <Chart
          options={{ xaxis: { categories: metrics?.parsed?.core_histogram_ping_time_seconds?.categories
            ? metrics?.parsed?.core_histogram_ping_time_seconds?.categories
            : [] } }}
          series={[
            { data: metrics?.parsed?.core_histogram_ping_time_seconds?.data
              ? metrics?.parsed?.core_histogram_ping_time_seconds?.data
              : [] },
          ]}
          type="bar"
          height={300}
          style={{
            maxWidth: '100%',
            width: '100%',
          }}
        />

        <Tooltip title="Displays the start-up time for your node (seconds).">
          <TableTitle>Start-up time</TableTitle>
        </Tooltip>
        <Chart
          options={{ xaxis: { categories: metrics?.parsed?.hoprd_histogram_startup_time_seconds?.categories
            ? metrics?.parsed?.hoprd_histogram_startup_time_seconds?.categories
            : [] } }}
          series={[
            { data: metrics?.parsed?.hoprd_histogram_startup_time_seconds?.data
              ? metrics?.parsed?.hoprd_histogram_startup_time_seconds?.data
              : [] },
          ]}
          type="bar"
          height={300}
          style={{
            maxWidth: '100%',
            width: '100%',
          }}
        />

        <Tooltip title="Displays the time it takes your node to reach a GREEN connection status (seconds).">
          <TableTitle>Time to reach high-level connection</TableTitle>
        </Tooltip>
        <Chart
          options={{ xaxis: { categories: metrics?.parsed?.hoprd_histogram_time_to_green_second?.categories
            ? metrics?.parsed?.hoprd_histogram_time_to_green_seconds?.categories
            : [] } }}
          series={[
            { data: metrics?.parsed?.hoprd_histogram_time_to_green_seconds?.data
              ? metrics?.parsed?.hoprd_histogram_time_to_green_seconds?.data
              : [] },
          ]}
          type="bar"
          height={300}
          style={{
            maxWidth: '100%',
            width: '100%',
          }}
        />

        <Tooltip title="Displays the latencies of received messages (seconds).">
          <TableTitle>Received message latencies</TableTitle>
        </Tooltip>
        <Chart
          options={{ xaxis: { categories: metrics?.parsed?.hoprd_histogram_message_latency_ms?.categories
            ? metrics?.parsed?.hoprd_histogram_message_latency_ms?.categories
            : [] } }}
          series={[
            { data: metrics?.parsed?.hoprd_histogram_message_latency_ms?.data
              ? metrics?.parsed?.hoprd_histogram_message_latency_ms?.data
              : [] },
          ]}
          type="bar"
          height={300}
          style={{
            maxWidth: '100%',
            width: '100%',
          }}
        />

        <Tooltip title="Displays your visible peers categorized by their connection quality.">
          <TableTitle>Peers by quality</TableTitle>
        </Tooltip>
        <Chart
          options={{ xaxis: { categories: metrics?.parsed?.core_mgauge_peers_by_quality?.categories
            ? metrics?.parsed?.core_mgauge_peers_by_quality?.categories
            : [] } }}
          series={[
            { data: metrics?.parsed?.core_mgauge_peers_by_quality?.data
              ? metrics?.parsed?.core_mgauge_peers_by_quality?.data
              : [] },
          ]}
          type="bar"
          height={300}
          style={{
            maxWidth: '100%',
            width: '100%',
          }}
        />
      </Paper>
    </Section>
  );
}

export default MetricsPage;
