import { ChannelOutgoingType, ChannelsOutgoingType, ChannelsIncomingType } from '../../store/slices/node/initialState';

/**
 * Checks how the channels have changed.
 *
 * @param previousChannels The previous channel state.
 * @param newChannels The new channel state.
 * @returns A boolean indicating whether the channels have changed.
 */
export const checkHowChannelsHaveChanged = (
  previousChannels: ChannelsIncomingType | ChannelsOutgoingType,
  newChannels: ChannelsIncomingType | ChannelsOutgoingType,
) => {
  const previousChannelsLocal = JSON.parse(JSON.stringify(previousChannels)) as ChannelsOutgoingType;
  const newChannelsLocal = JSON.parse(JSON.stringify(newChannels)) as ChannelsOutgoingType;

  const changes: ChannelOutgoingType[] = [];

  const previousChannelsOutgoing = Object.keys(previousChannelsLocal);
  const newChannelsOutgoing = Object.keys(newChannelsLocal);

  newChannelsOutgoing.forEach((newChannelId) => {
    const newChannel = newChannelsLocal[newChannelId];
    if (
      previousChannelsOutgoing.includes(newChannelId) &&
      previousChannelsLocal[newChannelId].status === newChannel.status
    ) {
      delete previousChannelsLocal[newChannelId];
      delete newChannelsLocal[newChannelId];
    } else if (!previousChannelsOutgoing.includes(newChannelId)) {
      changes.push({
        status: 'Open',
        peerAddress: newChannel.peerAddress,
      });
    } else if (newChannel.status === 'PendingToClose') {
      changes.push({
        status: 'PendingToClose',
        peerAddress: newChannel.peerAddress,
      });
    }
  });

  previousChannelsOutgoing.forEach((prevChannelId) => {
    const prevChannel = previousChannelsLocal[prevChannelId];
    if (!newChannelsOutgoing.includes(prevChannelId)) {
      changes.push({
        status: 'Closed',
        peerAddress: prevChannel.peerAddress,
      });
    }
  });

  return changes;
};
