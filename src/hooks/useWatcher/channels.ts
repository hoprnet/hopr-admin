import { GetChannelsResponseType } from '@hoprnet/hopr-sdk';

export const checkIfChannelsHaveChanged = (
  previousChannels: GetChannelsResponseType | null,
  newChannels: GetChannelsResponseType,
) => !!previousChannels && JSON.stringify(previousChannels) !== JSON.stringify(newChannels);

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
  const oldChannelsMap = new Map(allOldChannels?.map((channel) => [channel.channelId, channel]));
  const newChannelsMap = new Map(allNewChannels.map((channel) => [channel.channelId, channel]));

  // check for updates and new channels
  for (const newChannel of allNewChannels) {
    const tempOldChannel = oldChannelsMap.get(newChannel.channelId);

    // check if new channel is completely new
    // or differs in status
    if (!tempOldChannel || !isChannelStatusEqual(tempOldChannel, newChannel)) {
      updatedChannels.push(newChannel);
    }
  }

  // check for closed channels
  for (const oldChannel of allOldChannels ?? []) {
    const channelWasClosed = !newChannelsMap.has(oldChannel.channelId);
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
 * Checks if 2 channels have the same status
 */
const isChannelStatusEqual = (
  oldChannel: GetChannelsResponseType['incoming'][0],
  newChannel: GetChannelsResponseType['incoming'][0],
) => {
  return oldChannel.status === newChannel.status;
};
