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

const TableTitle = styled.p`
  font-family: 'Source Code Pro';
  font-size: 14px;
  font-weight: 700;
  height: 18px;
  overflow-wrap: break-word;
  padding: 8px;
`;

function MetricsPage() {
  const metrics = useAppSelector((selector) => selector.node.metrics);
  const loginData = useAppSelector((selector) => selector.auth.loginData);
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
      yellowLight
      fullHeightMin
    >
      <SubpageTitle
        title="Metrics"
        refreshFunction={handleRefresh}
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
      <TableExtended width1stColumn={'400px'}>{renderMetricsTable(metrics?.parsed)}</TableExtended>
      <br />
      <br />
      <br />

      <TableTitle>Measures total time it takes to ping a single node (seconds)</TableTitle>
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

      <TableTitle>Time it takes for a node to start up</TableTitle>
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

      <TableTitle>Time it takes for a node to transition to the GREEN network state</TableTitle>
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

      <TableTitle>Histogram of measured received message latencies</TableTitle>
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

      <TableTitle>Number different peer types by quality</TableTitle>
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
    </Section>
  );
}

export default MetricsPage;
