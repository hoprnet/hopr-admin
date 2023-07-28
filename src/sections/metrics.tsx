import { useEffect } from 'react';
import Section from '../future-hopr-lib-components/Section';
import { useAppDispatch, useAppSelector } from '../store';
import { actionsAsync } from '../store/slices/node/actionsAsync';
import Chart from 'react-apexcharts';

function MetricsPage() {
  const metrics = useAppSelector((selector) => selector.node.metrics);
  const loginData = useAppSelector((selector) => selector.auth.loginData);
  const {
    apiEndpoint,
    apiToken,
  } = loginData;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (apiEndpoint && apiToken) {
      dispatch(
        actionsAsync.getPrometheusMetricsThunk({
          apiEndpoint,
          apiToken,
        }),
      );
    }
  }, [apiEndpoint, apiToken]);

  function renderMetricsTable(parsedMetrics: any) {
    const render: any[] = [];
    for (const [key, value] of Object.entries(metrics.parsed)) {
      if (value.length === 1) render.push(<p>{value.name}</p>);
    }
    return <tbody>{render}</tbody>;
  }

  return (
    <Section
      yellow
      fullHeightMin
    >
      <h2>Metrics</h2>
      {renderMetricsTable(metrics?.parsed)}

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
        style={{
          maxWidth: '700px', width: '100%', height: '500px', 
        }}
      />

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
        style={{
          maxWidth: '700px', width: '100%', height: '500px', 
        }}
      />

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
        style={{
          maxWidth: '700px', width: '100%', height: '500px', 
        }}
      />

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
        style={{
          maxWidth: '700px', width: '100%', height: '500px', 
        }}
      />

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
        style={{
          maxWidth: '700px', width: '100%', height: '500px', 
        }}
      />
    </Section>
  );
}

export default MetricsPage;
