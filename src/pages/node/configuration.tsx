import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';

// HOPR Components
import { SubpageTitle } from '../../components/SubpageTitle';
import { TableExtended } from '../../future-hopr-lib-components/Table/columed-data';
import Section from '../../future-hopr-lib-components/Section';
import Button from '../../future-hopr-lib-components/Button';
import CodeCopyBox from '../../components/Code/CodeCopyBox';

// Mui
import { Paper, Switch } from '@mui/material';
import styled from '@emotion/styled';
import { appActions } from '../../store/slices/app';

const NotificationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

function SettingsPage() {
  const dispatch = useAppDispatch();
  const prevNotificationSettings = useAppSelector((store) => store.app.configuration.notifications);
  const strategies = useAppSelector((store) => store.node.configuration.data?.hopr?.strategy);
  const configuration = useAppSelector((store) => store.node.configuration.data);
  const ticketPrice = useAppSelector((store) => store.node.ticketPrice.data);
  const [strategiesString, set_strategiesString] = useState<string | null>(null);
  const [configurationString, set_configurationString] = useState<string | null>(null);
  const [localNotificationSettings, set_localNotificationSettings] = useState<typeof prevNotificationSettings>();

  useEffect(() => {
    if (prevNotificationSettings) {
      set_localNotificationSettings(prevNotificationSettings);
    }
  }, [prevNotificationSettings]);

  useEffect(() => {
    if (strategies) {
      let tmp = JSON.stringify(strategies, null, 2);

      try {
        if (ticketPrice) {
          // min_stake_threshold
          if (strategies?.strategies?.AutoFunding?.min_stake_threshold) {
            const key = 'min_stake_threshold';
            const min_stake_threshold = strategies.strategies.AutoFunding[key].replace(' HOPR', '');
            const min_stake_thresholdBigInt = BigInt(min_stake_threshold) * BigInt(1e18);
            const ticketBigInt = BigInt(ticketPrice);
            const ticketsBigInt = min_stake_thresholdBigInt / ticketBigInt;
            const ticketsString = ticketsBigInt.toString();
            const stringToReplace = `"${key}": "${strategies.strategies.AutoFunding[key]}"`;
            if (tmp.includes(stringToReplace + ',')) {
              tmp = tmp.replace(
                stringToReplace + ',',
                `"${key}": "${strategies.strategies.AutoFunding[key]}", // tickets: ${ticketsString}`,
              );
            } else {
              tmp = tmp.replace(
                stringToReplace,
                `"${key}": "${strategies.strategies.AutoFunding[key]}" // tickets: ${ticketsString}`,
              );
            }
          }

          // funding_amount
          if (strategies?.strategies?.AutoFunding?.funding_amount) {
            const key = 'funding_amount';
            const funding_amount = strategies.strategies.AutoFunding[key].replace(' HOPR', '');
            const funding_amountBigInt = BigInt(funding_amount) * BigInt(1e18);
            const ticketBigInt = BigInt(ticketPrice);
            const ticketsBigInt = funding_amountBigInt / ticketBigInt;
            const ticketsString = ticketsBigInt.toString();
            const stringToReplace = `"${key}": "${strategies.strategies.AutoFunding[key]}"`;
            if (tmp.includes(stringToReplace + ',')) {
              tmp = tmp.replace(
                stringToReplace + ',',
                `"${key}": "${strategies.strategies.AutoFunding[key]}", // tickets: ${ticketsString}`,
              );
            } else {
              tmp = tmp.replace(
                stringToReplace,
                `"${key}": "${strategies.strategies.AutoFunding[key]}" // tickets: ${ticketsString}`,
              );
            }
          }

          // minimum_redeem_ticket_value
          if (strategies?.strategies?.AutoRedeeming?.minimum_redeem_ticket_value) {
            const key = 'minimum_redeem_ticket_value';
            const minimum_redeem_ticket_value = strategies.strategies.AutoRedeeming[key].replace(' HOPR', '');
            const minimum_redeem_ticket_valueBigInt = BigInt(minimum_redeem_ticket_value) * BigInt(1e18);
            const ticketBigInt = BigInt(ticketPrice);
            const ticketsBigInt = minimum_redeem_ticket_valueBigInt / ticketBigInt;
            const ticketsString = ticketsBigInt.toString();
            const stringToReplace = `"${key}": "${strategies.strategies.AutoRedeeming[key]}"`;
            if (tmp.includes(stringToReplace + ',')) {
              tmp = tmp.replace(
                stringToReplace + ',',
                `"${key}": "${strategies.strategies.AutoRedeeming[key]}", // tickets: ${ticketsString}`,
              );
            } else {
              tmp = tmp.replace(
                stringToReplace,
                `"${key}": "${strategies.strategies.AutoRedeeming[key]}" // tickets: ${ticketsString}`,
              );
            }
          }

          // on_close_redeem_single_tickets_value_min
          if (strategies?.strategies?.AutoRedeeming?.on_close_redeem_single_tickets_value_min) {
            const key = 'on_close_redeem_single_tickets_value_min';
            const on_close_redeem_single_tickets_value_min = strategies.strategies.AutoRedeeming[key].replace(
              ' HOPR',
              '',
            );
            const on_close_redeem_single_tickets_value_minBigInt =
              BigInt(on_close_redeem_single_tickets_value_min) * BigInt(1e18);
            const ticketBigInt = BigInt(ticketPrice);
            const ticketsBigInt = on_close_redeem_single_tickets_value_minBigInt / ticketBigInt;
            const ticketsString = ticketsBigInt.toString();
            const stringToReplace = `"${key}": "${strategies.strategies.AutoRedeeming[key]}"`;
            if (tmp.includes(stringToReplace + ',')) {
              tmp = tmp.replace(
                stringToReplace + ',',
                `"${key}": "${strategies.strategies.AutoRedeeming[key]}", // tickets: ${ticketsString}`,
              );
            } else {
              tmp = tmp.replace(
                stringToReplace,
                `"${key}": "${strategies.strategies.AutoRedeeming[key]}" // tickets: ${ticketsString}`,
              );
            }
          }
        }
      } catch (e) {
        console.warn('Error while counting strategies against current ticket price.', e);
      }

      set_strategiesString(tmp);
    }
  }, [strategies, ticketPrice]);

  useEffect(() => {
    if (configuration) {
      let tmp = JSON.parse(JSON.stringify(configuration));
      tmp.hopr['strategy'] && delete tmp.hopr['strategy'];
      tmp = JSON.stringify(tmp, null, 2);
      set_configurationString(tmp);
    }
  }, [configuration]);


  const handleSaveSettings = async () => {
    if (localNotificationSettings) {
      dispatch(appActions.setNotificationSettings(localNotificationSettings));
    }
  };

  return (
    <Section
      className="Section--settings"
      id="Section--settings"
      fullHeightMin
      yellow
    >
      <SubpageTitle title="CONFIGURATION" />
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
                            ...localNotificationSettings,
                            channels: !localNotificationSettings.channels,
                          });
                        }
                      }}
                      color="primary"
                    />{' '}
                    True
                  </div>
                  <div>
                    Message: False
                    <Switch
                      checked={localNotificationSettings?.message}
                      onChange={() => {
                        if (localNotificationSettings) {
                          set_localNotificationSettings({
                            ...localNotificationSettings,
                            message: !localNotificationSettings.message,
                          });
                        }
                      }}
                      color="primary"
                    />{' '}
                    True
                  </div>
                  <div>
                    Node Balance: False
                    <Switch
                      checked={localNotificationSettings?.nodeBalances}
                      onChange={() => {
                        if (localNotificationSettings) {
                          set_localNotificationSettings({
                            ...localNotificationSettings,
                            nodeBalances: !localNotificationSettings.nodeBalances,
                          });
                        }
                      }}
                      color="primary"
                    />{' '}
                    True
                  </div>
                  <div>
                    Node Info: False
                    <Switch
                      checked={localNotificationSettings?.nodeInfo}
                      onChange={() => {
                        if (localNotificationSettings) {
                          set_localNotificationSettings({
                            ...localNotificationSettings,
                            nodeInfo: !localNotificationSettings.nodeInfo,
                          });
                        }
                      }}
                      color="primary"
                    />{' '}
                    True
                  </div>
                </NotificationsContainer>
              </td>
            </tr>
            <tr>
              <th>Strategies</th>
              <td>
                {strategiesString && (
                  <CodeCopyBox
                    code={strategiesString}
                    breakSpaces
                  />
                )}
              </td>
            </tr>
            <tr>
              <th>Configuration</th>
              <td>
                {configurationString && (
                  <CodeCopyBox
                    code={configurationString}
                    breakSpaces
                  />
                )}
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
