import { Message, initialState } from '../../store/slices/node/initialState';

export type WatcherMessage = {
  createdAt: number;
  amountOfTimesRepeated: number;
  message?: Message;
} | null;

export const getLatestMessage = (newMessages?: (typeof initialState)['messages']): WatcherMessage | undefined => {
  if (!newMessages?.length) return;

  const sortedMessages = [...newMessages].sort((a, b) => b.createdAt - a.createdAt);
  const latestMessage = sortedMessages?.[0];
  const latestTimestamp = latestMessage.createdAt ?? 0;
  const amountOfMessagesWithTimestamp = newMessages.filter((msg) => msg.createdAt === latestTimestamp)?.length;

  return {
    createdAt: latestTimestamp,
    amountOfTimesRepeated: amountOfMessagesWithTimestamp,
    message: latestMessage,
  };
};

export const checkForNewMessage = (oldMessage: WatcherMessage, newMessage: NonNullable<WatcherMessage>) => {
  if (!oldMessage) return true;

  if (oldMessage.createdAt < newMessage.createdAt) {
    return true;
  }

  if (oldMessage.createdAt === newMessage.createdAt) {
    return oldMessage.amountOfTimesRepeated < newMessage.amountOfTimesRepeated;
  }

  return false;
};
