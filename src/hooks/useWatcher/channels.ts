import { ChannelsParsed, ChannelOutgoingType } from '../../store/slices/node/initialState';

/**
 * Checks how the channels have changed.
 *
 * @param previousChannels The previous channel state.
 * @param newChannels The new channel state.
 * @returns A boolean indicating whether the channels have changed.
 */
export const checkHowChannelsHaveChanged = (
  previousChannels: ChannelsParsed,
  newChannels: ChannelsParsed,
) => {
  let previousChannelsLocal = JSON.parse(JSON.stringify(previousChannels)) as ChannelsParsed;
  let newChannelsLocal = JSON.parse(JSON.stringify(newChannels)) as ChannelsParsed;

  let changes: ChannelOutgoingType[] = [];

  let previousChannelsOutgoing = Object.keys(previousChannelsLocal.outgoing);
  let newChannelsOutgoing = Object.keys(newChannelsLocal.outgoing);

  newChannelsOutgoing.forEach(newChannelId => {
    const newChannel = newChannelsLocal.outgoing[newChannelId];
    if(
      previousChannelsOutgoing.includes(newChannelId) &&
      ( previousChannelsLocal.outgoing[newChannelId].status === newChannel.status )
    ) {
      delete previousChannelsLocal.outgoing[newChannelId];
      delete newChannelsLocal.outgoing[newChannelId];
    }
    else if (!previousChannelsOutgoing.includes(newChannelId)) {
      changes.push({
        status: "Open",
        peerAddress: newChannel.peerAddress
      });
    }
    else if (newChannel.status === 'PendingToClose') {
      changes.push({
        status: "PendingToClose",
        peerAddress: newChannel.peerAddress
      });
    }
  });


  previousChannelsOutgoing.forEach(prevChannelId => {
    const prevChannel = previousChannelsLocal.outgoing[prevChannelId];
    if(!newChannelsOutgoing.includes(prevChannelId)){
      changes.push({
        status: "Closed",
        peerAddress: prevChannel.peerAddress
      });
    }
  });

  return changes
}
