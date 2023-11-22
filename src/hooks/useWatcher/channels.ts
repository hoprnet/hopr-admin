import { GetChannelsResponseType } from '@hoprnet/hopr-sdk';
import { observeData } from './observeData';
import { sendNotification } from './notifications';
import { useAppDispatch } from '../../store';
import { nodeActionsAsync } from '../../store/slices/node';

/**
 * Checks if the channels have changed.
 *
 * @param previousChannels The previous channel state.
 * @param newChannels The new channel state.
 * @returns A boolean indicating whether the channels have changed.
 */
export const checkIfChannelsHaveChanged = (
  previousChannels: GetChannelsResponseType | null,
  newChannels: GetChannelsResponseType,
) => !!previousChannels && JSON.stringify(previousChannels) !== JSON.stringify(newChannels);

/**
 * Generates a notification text based on the updated channel's status.
 *
 * @param updatedChannel The updated channel.
 * @returns The text for the notification.
 */
export const calculateNotificationTextForChannelStatus = (updatedChannel: GetChannelsResponseType['incoming'][0]) => {
  if (updatedChannel.status === 'Closed') {
    return 'Channel is closed';
  }

  if (updatedChannel.status === 'Open') {
    return 'Channel is open';
  }

  if (updatedChannel.status === 'PendingToClose') {
    return 'Channel is closing';
  }

  if (updatedChannel.status === 'WaitingForCommitment') {
    return 'Channel is opening';
  }

  return 'Channel has updated status';
};

/**
 * Compares old channels with new channels and determines which have been updated.
 *
 * @param oldChannels The previous channel state.
 * @param newChannels The new channel state.
 * @returns An array of channels that have been updated.
 */
export const getUpdatedChannels = (
  oldChannels: GetChannelsResponseType | null,
  newChannels: GetChannelsResponseType,
) => {
  // check if channels are exactly the same
  if (JSON.stringify(oldChannels) === JSON.stringify(newChannels)) {
    return [];
  }

  const updatedChannels: GetChannelsResponseType['incoming'] = [];

  // join incoming and outgoing channels into one array
  const allOldChannels = oldChannels?.incoming.concat(oldChannels.outgoing);
  const allNewChannels = newChannels.incoming.concat(newChannels.outgoing);

  // create map of channels to optimize lookup
  const oldChannelsMap = new Map(allOldChannels?.map((channel) => [channel.id, channel]));
  const newChannelsMap = new Map(allNewChannels.map((channel) => [channel.id, channel]));

  // check for updates and new channels
  for (const newChannel of allNewChannels) {
    const tempOldChannel = oldChannelsMap.get(newChannel.id);

    // check if new channel is completely new
    // or differs in status
    if (!tempOldChannel || !isChannelStatusEqual(tempOldChannel, newChannel)) {
      updatedChannels.push(newChannel);
    }
  }

  // check for closed channels
  for (const oldChannel of allOldChannels ?? []) {
    const channelWasClosed = !newChannelsMap.has(oldChannel.id);
    if (channelWasClosed) {
      updatedChannels.push({
        ...oldChannel,
        status: 'Closed',
      });
    }
  }
  return updatedChannels;
};

/**
 * Checks if the status of two channels is equal.
 *
 * @param oldChannel The old channel.
 * @param newChannel The new channel.
 * @returns A boolean indicating whether the channel statuses are equal.
 */
const isChannelStatusEqual = (
  oldChannel: GetChannelsResponseType['incoming'][0],
  newChannel: GetChannelsResponseType['incoming'][0],
) => {
  return oldChannel.status === newChannel.status;
};

/**
 * Observes channels and handles notifications when changes are detected.
 *
 * @param previousState The previous state of the channels.
 * @param apiToken The API token as a string, or null.
 * @param apiEndpoint The API endpoint as a string, or null.
 * @param updatePreviousData A function that updates the previous data with the current data.
 * @param dispatch The dispatch function returned by the useAppDispatch hook.
 */
export const observeChannels = ({
  previousState,
  apiEndpoint,
  apiToken,
  active,
  updatePreviousData,
  dispatch,
}: {
  previousState: GetChannelsResponseType | null;
  apiToken: string | null;
  apiEndpoint: string | null;
  active: boolean;
  updatePreviousData: (currentData: GetChannelsResponseType) => void;
  dispatch: ReturnType<typeof useAppDispatch>;
}) =>
  observeData<GetChannelsResponseType>({
    active: !!apiEndpoint && !!apiToken && active,
    previousData: previousState,
    fetcher: async () => {
      if (!apiEndpoint || !apiToken) return;
      return dispatch(
        nodeActionsAsync.getChannelsThunk({
          apiEndpoint,
          apiToken,
        }),
      ).unwrap();
    },
    isDataDifferent: (newChannels) => checkIfChannelsHaveChanged(previousState, newChannels),
    notificationHandler: (newChannels) => {
      const updatedChannels = getUpdatedChannels(previousState, newChannels);
      for (const updatedChannel of updatedChannels ?? []) {
        // calculate the type of update: OPEN/CLOSE etc.
        const notificationText = calculateNotificationTextForChannelStatus(updatedChannel);
        sendNotification({
          notificationPayload: {
            source: 'node',
            name: notificationText,
            url: null,
            timeout: null,
          },
          toastPayload: { message: `${updatedChannel.id}: ${notificationText}` },
          dispatch,
        });
      }
    },
    updatePreviousData,
  });
