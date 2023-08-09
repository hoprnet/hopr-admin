import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { nodeActionsAsync } from '../../store/slices/node';

// HOPR Components
import { SubpageTitle } from '../../components/SubpageTitle';
import { TableExtended } from '../../future-hopr-lib-components/Table/columed-data';
import Section from '../../future-hopr-lib-components/Section';
import Select from '../../future-hopr-lib-components/Select';

// Mui
import {
  TableHead,
  TableRow,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  Switch,
  SelectChangeEvent
} from '@mui/material';

function SettingsPage() {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector((selector) => selector.auth.loginData);
  const settings = useAppSelector((selector) => selector.node.settings.data);
  const [localSettings, set_localSettings] = useState<{
    includeRecipient?: boolean;
    strategy?: string;
  }>({
    includeRecipient: false,
    strategy: '',
  });

  useEffect(() => {
    handleRefresh();
  }, [loginData]);

  const handleRefresh = () => {
    if (loginData.apiEndpoint && loginData.apiToken) {
      dispatch(
        nodeActionsAsync.getSettingsThunk({
          apiEndpoint: loginData.apiEndpoint,
          apiToken: loginData.apiToken,
        }),
      );
    }
  };

  useEffect(() => {
    if (settings) {
      set_localSettings({ ...settings });
    }
  }, [settings]);

  const handleIncludeRecipientChange = () => {
    set_localSettings((prevState) => ({
      ...prevState,
      includeRecipient: !prevState.includeRecipient,
    }));
  };

  const handleStrategyChange = (event: SelectChangeEvent<unknown>) => {
    set_localSettings((prevState) => ({
      ...prevState,
      strategy: event.target.value as string,
    }));
  };

  const getValueLabel = (value: string) => {
    const selectedValue = strategies.find((item) => item.value === value);
    return selectedValue ? selectedValue.name : '';
  };

  const strategies = [
    {
      value: 'passive',
      name: 'Passive',
    },
    {
      value: 'promiscuous',
      name: 'Promiscuous',
    },
    {
      value: 'random',
      name: 'Random',
    },
  ];

  const handleSaveSettings = async () => {
    if (settings?.includeRecipient != localSettings.includeRecipient) {
      await dispatch(
        nodeActionsAsync.setSettingThunk({
          apiEndpoint: loginData.apiEndpoint!,
          apiToken: loginData.apiToken!,
          setting: 'includeRecipient',
          settingValue: localSettings.includeRecipient,
        }),
      )
        .unwrap()
        .catch((e) => {
          console.log(e.error);
        });
    }

    if (settings?.strategy != localSettings.strategy) {
      await dispatch(
        nodeActionsAsync.setSettingThunk({
          apiEndpoint: loginData.apiEndpoint!,
          apiToken: loginData.apiToken!,
          setting: 'strategy',
          settingValue: localSettings.strategy,
        }),
      )
        .unwrap()
        .catch((e) => {
          console.log(e.error);
        });
    }
  };

  return (
    <Section
      className="Section--settings"
      id="Section--settings"
      fullHeightMin
    >
      <SubpageTitle
        title="CONFIGURATION"
        refreshFunction={handleRefresh}
      />
      <TableExtended
        title="Node"
        style={{ marginBottom: '32px' }}
      >
        <tbody>
          <tr>
            <th>Include Recipient</th>
            <td>
              False
              <Switch
                checked={localSettings.includeRecipient}
                onChange={handleIncludeRecipientChange}
                color="primary"
              />{' '}
              True
            </td>
          </tr>
          <tr>
            <th>Strategy</th>
            <td>
              <Select
                size="small"
                values={strategies}
                disabled={!localSettings}
                value={localSettings.strategy}
                onChange={handleStrategyChange}
                style={{
                  width: '200px',
                  margin: 0,
                }}
                renderValue={() => {
                  return getValueLabel(localSettings.strategy!);
                }}
              />
            </td>
          </tr>
        </tbody>
      </TableExtended>
      <button
        style={{ marginTop: '1rem' }}
        onClick={handleSaveSettings}
      >
        Save
      </button>
    </Section>
  );
}

export default SettingsPage;
