import { useEffect, useState } from 'react';
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
import { useAppDispatch, useAppSelector } from '../store';
import Section from '../future-hopr-lib-components/Section';
import Select from '../future-hopr-lib-components/Select';
import { nodeActionsAsync } from '../store/slices/node';

function SettingsPage() {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector((selector) => selector.auth.loginData);
  const settings = useAppSelector((selector) => selector.node.settings);
  const [localSettings, set_localSettings] = useState<{
    includeRecipient?: boolean;
    strategy?: string;
  }>({
    includeRecipient: false,
    strategy: '',
  });

  useEffect(() => {
    if (loginData.apiEndpoint && loginData.apiToken) {
      dispatch(
        nodeActionsAsync.getSettingsThunk({
          apiEndpoint: loginData.apiEndpoint,
          apiToken: loginData.apiToken,
        }),
      );
    }
  }, [loginData]);

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
      yellow
    >
      <h2>Settings</h2>
      <TableContainer>
        <Table
          sx={{ minWidth: 650 }}
          aria-label="settings table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Include Recipient</TableCell>
              <TableCell>Strategy</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                False
                <Switch
                  checked={localSettings.includeRecipient}
                  onChange={handleIncludeRecipientChange}
                  color="primary"
                />{' '}
                True
              </TableCell>
              <TableCell>
                <Select
                  label={'Strategy'}
                  values={strategies}
                  disabled={!localSettings}
                  value={localSettings.strategy}
                  onChange={handleStrategyChange}
                  style={{ width: '100%' }}
                  renderValue={() => {
                    return getValueLabel(localSettings.strategy!);
                  }}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
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
