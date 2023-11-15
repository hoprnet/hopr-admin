import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { nodeActionsAsync } from '../../store/slices/node';

// HOPR Components
import { SubpageTitle } from '../../components/SubpageTitle';
import { TableExtended } from '../../future-hopr-lib-components/Table/columed-data';
import Section from '../../future-hopr-lib-components/Section';
import Select from '../../future-hopr-lib-components/Select';
import Button from '../../future-hopr-lib-components/Button';

// Mui
import { Paper, Switch, SelectChangeEvent } from '@mui/material';
import styled from '@emotion/styled';
import { appActions } from '../../store/slices/app';


const NotificationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

function SettingsPage() {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector((store) => store.auth.loginData);
  const settings = useAppSelector((store) => store.node.settings.data);
  const settingsFetching = useAppSelector((store) => store.node.settings.isFetching);
  const prevNotificationSettings = useAppSelector(store => store.app.configuration.notifications)
  const [localNotificationSettings, set_localNotificationSettings] = useState<typeof prevNotificationSettings>()
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

  useEffect(() => {
    if (prevNotificationSettings) {
      set_localNotificationSettings(prevNotificationSettings)
    }
  }, [prevNotificationSettings]);

  const handleIncludeRecipientChange = () => {
    set_localSettings((prevState) => ({
      ...prevState,
      includeRecipient: !prevState.includeRecipient,
    }));
  };
  
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

    if (localNotificationSettings) {
      dispatch(appActions.setNotificationSettings(localNotificationSettings))
    }  
  };

  return (
    <Section
      className="Section--settings"
      id="Section--settings"
      fullHeightMin
      yellow
    >
      <SubpageTitle
        title="CONFIGURATION"
        refreshFunction={handleRefresh}
        reloading={settingsFetching}
      />
      <Paper
        style={{
          padding: '24px',
          width: 'calc( 100% - 48px )',
        }}
      >
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
              <th>Notifications</th>
              <td>
                <NotificationsContainer>
                  <div>
                  Channels: False
                    <Switch
                      checked={localNotificationSettings?.channels}
                      onChange={() => {
                        if (localNotificationSettings) {
                          set_localNotificationSettings({
                            ...localNotificationSettings, channels: !localNotificationSettings.channels,
                          })
                        }
                      }}
                      color="primary"
                    />{' '}True
                  </div>  
                  <div>
                  Message: False
                    <Switch
                      checked={localNotificationSettings?.message}
                      onChange={() => {
                        if (localNotificationSettings) {
                          set_localNotificationSettings({
                            ...localNotificationSettings, message: !localNotificationSettings.message,
                          })
                        }
                      }}
                      color="primary"
                    />{' '}True
                  </div>  
                  <div>
                  Node Balance: False
                    <Switch
                      checked={localNotificationSettings?.nodeBalances}
                      onChange={() => {
                        if (localNotificationSettings) {
                          set_localNotificationSettings({
                            ...localNotificationSettings, nodeBalances: !localNotificationSettings.nodeBalances,
                          })
                        }
                      }}
                      color="primary"
                    />{' '}True
                  </div>  
                  <div>
                  Node Info: False
                    <Switch
                      checked={localNotificationSettings?.nodeInfo}
                      onChange={() => {
                        if (localNotificationSettings) {
                          set_localNotificationSettings({
                            ...localNotificationSettings, nodeInfo: !localNotificationSettings.nodeInfo,
                          })
                        }
                      }}
                      color="primary"
                    />{' '}True
                  </div>                
                </NotificationsContainer>
              </td>
            </tr>
          </tbody>
        </TableExtended>
        <Button
          style={{
            marginTop: '1rem',
            float: 'right',
          }}
          onClick={handleSaveSettings}
        >
          Save
        </Button>
      </Paper>
    </Section>
  );
}

export default SettingsPage;
