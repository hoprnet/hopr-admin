import { useEffect } from 'react';
import Section from '../future-hopr-lib-components/Section';
import {
  useAppDispatch, useAppSelector 
} from '../store';
import { actionsAsync } from '../store/slices/node/actionsAsync';

function MetricsPage() {
  const metrics = useAppSelector((selector) => selector.node.metrics);
  const loginData = useAppSelector((selector) => selector.auth.loginData);
  const {
    apiEndpoint, apiToken, 
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

  return (
    <Section
      yellow
      fullHeightMin
    >
      <h2>Metrics</h2>
      <pre>{metrics}</pre>
    </Section>
  );
}

export default MetricsPage;
